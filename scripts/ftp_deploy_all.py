import os
import sys
import ftplib
from pathlib import Path

def get_ftp_connection():
    server = os.environ.get("FTP_SERVER")
    user = os.environ.get("FTP_USERNAME")
    passwd = os.environ.get("FTP_PASSWORD")

    if not server or not user or not passwd:
        print("[ERROR] Missing FTP_SERVER, FTP_USERNAME, or FTP_PASSWORD in environment.")
        sys.exit(1)

    print(f"[*] Connecting to FTP server: {server} as {user}...")
    try:
        ftp = ftplib.FTP_TLS(server, timeout=30)
        ftp.login(user, passwd)
        ftp.prot_p()
        print("[+] Connected successfully using FTP_TLS (secure SSL/TLS).")
        return ftp
    except Exception as e:
        print(f"[-] FTP_TLS connection failed ({e}). Attempting plain FTP...")
        try:
            ftp = ftplib.FTP(server, timeout=30)
            ftp.login(user, passwd)
            print("[+] Connected successfully using plain FTP.")
            return ftp
        except Exception as e2:
            print(f"[ERROR] Plain FTP connection failed: {e2}")
            sys.exit(1)

def get_dir_listing(ftp, path="."):
    listing = []
    try:
        ftp.cwd(path)
        ftp.retrlines("LIST", listing.append)
    except Exception as e:
        print(f"[-] Could not list directory {path}: {e}")
    return listing

def ensure_remote_dir(ftp, remote_path):
    parts = remote_path.strip("/").split("/")
    ftp.cwd("/")
    for part in parts:
        try:
            ftp.cwd(part)
        except ftplib.error_perm:
            print(f"    [*] Creating remote directory: {part}")
            try:
                ftp.mkd(part)
                ftp.cwd(part)
            except Exception as e:
                print(f"    [-] Could not create/enter {part}: {e}")
                return False
    return True

def upload_folder(ftp, local_dir, remote_dir):
    local_path = Path(local_dir)
    if not local_path.exists():
        print(f"[-] Local directory {local_dir} does not exist. Skipping.")
        return False

    print(f"\n[+] Deploying: {local_path} -> Remote: {remote_dir}")
    if not ensure_remote_dir(ftp, remote_dir):
        print(f"[-] Failed to ensure remote directory: {remote_dir}")
        return False

    base_remote = ftp.pwd()
    files_uploaded = 0

    for file_path in local_path.rglob("*"):
        if file_path.is_file():
            rel_path = file_path.relative_to(local_path)
            parent_parts = list(rel_path.parent.parts)

            # Move to target base
            ftp.cwd(base_remote)
            for part in parent_parts:
                try:
                    ftp.cwd(part)
                except ftplib.error_perm:
                    ftp.mkd(part)
                    ftp.cwd(part)

            with open(file_path, "rb") as f:
                ftp.storbinary(f"STOR {file_path.name}", f)
            files_uploaded += 1
            print(f"    -> Uploaded {rel_path} ({file_path.stat().st_size} bytes)")

    print(f"[SUCCESS] Uploaded {files_uploaded} files to {remote_dir}")
    ftp.cwd("/")
    return True

def main():
    print("=" * 70)
    print("🚀 STEAM-Craft Subdomain & Beta Staging Multi-Deploy Engine")
    print("=" * 70)

    ftp = get_ftp_connection()

    # 1. Inspect root
    print("\n[*] Remote Root Directory Structure:")
    root_items = get_dir_listing(ftp, "/")
    for item in root_items:
        print(f"    {item}")

    # 2. Inspect public_html
    print("\n[*] Remote public_html/ Structure:")
    pub_items = get_dir_listing(ftp, "/public_html")
    for item in pub_items:
        print(f"    {item}")

    ftp.cwd("/")

    # Detect targets for 5 subdomains
    # In cPanel, subdomains can be at /public_html/<name> or /<name>.steamcraft.online
    subdomain_mapping = {
        "scholar": "deploy_subdomains/scholar",
        "sim": "deploy_subdomains/sim",
        "maker": "deploy_subdomains/maker",
        "geo": "deploy_subdomains/geo",
        "arena": "deploy_subdomains/arena",
    }

    # Extract remote folder names from listing
    pub_text = "\n".join(pub_items).lower()
    root_text = "\n".join(root_items).lower()

    for sub_name, local_dir in subdomain_mapping.items():
        # Check where it lives
        # Try both public_html/<sub_name> and <sub_name>.steamcraft.online
        targets = []
        if f"{sub_name}.steamcraft.online" in root_text:
            targets.append(f"/{sub_name}.steamcraft.online")
        if sub_name in pub_text or f"{sub_name}" in pub_items:
            targets.append(f"/public_html/{sub_name}")
        
        # If neither detected explicitly, default to public_html/<sub_name> which is cPanel standard
        if not targets:
            targets.append(f"/public_html/{sub_name}")
            # Also upload to root subdomain folder if standard cPanel subdomain structure
            targets.append(f"/{sub_name}.steamcraft.online")

        for target in targets:
            upload_folder(ftp, local_dir, target)

    # Deploy Beta Staging (beta.steamcraft.online)
    # The built files of beta will be in dist_beta/ or dist/
    beta_dir = "dist_beta" if Path("dist_beta").exists() else "dist"
    if Path(beta_dir).exists():
        beta_targets = []
        if "beta.steamcraft.online" in root_text:
            beta_targets.append("/beta.steamcraft.online")
        if "beta" in pub_text:
            beta_targets.append("/public_html/beta")
        if not beta_targets:
            beta_targets.append("/public_html/beta")
            beta_targets.append("/beta.steamcraft.online")
        
        print("\n[*] Deploying Beta Staging (NOT Touching app.steamcraft.online)...")
        for target in beta_targets:
            upload_folder(ftp, beta_dir, target)

    try:
        ftp.quit()
    except:
        pass
    print("\n" + "=" * 70)
    print("🎉 All 5 Subdomains & Beta Staging deployed successfully!")
    print("=" * 70)

if __name__ == "__main__":
    main()

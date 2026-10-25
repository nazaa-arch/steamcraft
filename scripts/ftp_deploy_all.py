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

    # Subdomain mapping: target both explicit and conventional folders
    deploy_targets = [
        # PaperCraft AI -> PaperAI (explicit on cPanel), scholar, and scholar.steamcraft.online
        ("deploy_subdomains/scholar", "/public_html/PaperAI"),
        ("deploy_subdomains/scholar", "/public_html/scholar"),
        ("deploy_subdomains/scholar", "/scholar.steamcraft.online"),
        
        # SteamSim Lab
        ("deploy_subdomains/sim", "/public_html/sim"),
        ("deploy_subdomains/sim", "/sim.steamcraft.online"),
        
        # MakerCraft 3D
        ("deploy_subdomains/maker", "/public_html/maker"),
        ("deploy_subdomains/maker", "/maker.steamcraft.online"),
        
        # SteamGeo Intelligence
        ("deploy_subdomains/geo", "/public_html/geo"),
        ("deploy_subdomains/geo", "/geo.steamcraft.online"),
        
        # SteamArena
        ("deploy_subdomains/arena", "/public_html/arena"),
        ("deploy_subdomains/arena", "/arena.steamcraft.online"),
        
        # Beta Staging Portal
        ("dist_beta", "/public_html/beta"),
        ("dist_beta", "/beta.steamcraft.online"),

        # SteamCraft Web App (app.steamcraft.online & public_html)
        ("dist", "/public_html/app"),
        ("dist", "/app.steamcraft.online"),
        ("dist", "/public_html")
    ]

    for local_dir, remote_dir in deploy_targets:
        upload_folder(ftp, local_dir, remote_dir)

    # Upload main .htaccess with beta routing to public_html/.htaccess
    htaccess_file = Path("public/.htaccess")
    if htaccess_file.exists():
        print("\n[+] Updating /public_html/.htaccess for seamless beta routing...")
        try:
            ftp.cwd("/public_html")
            with open(htaccess_file, "rb") as f:
                ftp.storbinary("STOR .htaccess", f)
            print("[SUCCESS] /public_html/.htaccess updated.")
        except Exception as e:
            print(f"[-] Could not update .htaccess: {e}")

    try:
        ftp.quit()
    except:
        pass
    print("\n" + "=" * 70)
    print("🎉 All Subdomains & Beta Staging successfully synchronized!")
    print("=" * 70)

if __name__ == "__main__":
    main()

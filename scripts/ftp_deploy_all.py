import os
import sys
import ftplib
import time
from pathlib import Path

class RobustFTPDeployer:
    def __init__(self):
        self.server = os.environ.get("FTP_SERVER")
        self.user = os.environ.get("FTP_USERNAME")
        self.passwd = os.environ.get("FTP_PASSWORD")

        if not self.server or not self.user or not self.passwd:
            print("[ERROR] Missing FTP_SERVER, FTP_USERNAME, or FTP_PASSWORD in environment.")
            sys.exit(1)

        self.ftp = None
        self.connect()

    def connect(self):
        if self.ftp:
            try:
                self.ftp.quit()
            except Exception:
                pass
            self.ftp = None

        print(f"[*] Connecting to FTP server: {self.server} as {self.user}...")
        try:
            ftp = ftplib.FTP_TLS(self.server, timeout=60)
            ftp.login(self.user, self.passwd)
            ftp.prot_p()
            print("[+] Connected successfully using FTP_TLS (secure SSL/TLS).")
            self.ftp = ftp
        except Exception as e:
            print(f"[-] FTP_TLS connection failed ({e}). Attempting plain FTP...")
            try:
                ftp = ftplib.FTP(self.server, timeout=60)
                ftp.login(self.user, self.passwd)
                print("[+] Connected successfully using plain FTP.")
                self.ftp = ftp
            except Exception as e2:
                print(f"[ERROR] Plain FTP connection failed: {e2}")
                sys.exit(1)

    def reconnect(self):
        print("[*] Reconnecting FTP session...")
        time.sleep(2)
        self.connect()

    def ensure_remote_dir(self, remote_path):
        parts = remote_path.strip("/").split("/")
        self.ftp.cwd("/")
        for part in parts:
            try:
                self.ftp.cwd(part)
            except ftplib.error_perm:
                print(f"    [*] Creating remote directory: {part}")
                try:
                    self.ftp.mkd(part)
                    self.ftp.cwd(part)
                except Exception as e:
                    print(f"    [-] Could not create/enter {part}: {e}")
                    return False
        return True

    def upload_folder(self, local_dir, remote_dir):
        local_path = Path(local_dir)
        if not local_path.exists():
            print(f"[-] Local directory {local_dir} does not exist. Skipping.")
            return False

        print(f"\n[+] Deploying: {local_path} -> Remote: {remote_dir}")

        for attempt in range(3):
            try:
                if self.ensure_remote_dir(remote_dir):
                    break
                else:
                    print(f"[-] Failed to ensure remote directory: {remote_dir}")
                    return False
            except Exception as e:
                print(f"[-] Error ensuring dir {remote_dir} (attempt {attempt+1}/3): {e}")
                self.reconnect()
                if attempt == 2:
                    return False

        base_remote = self.ftp.pwd()
        files_uploaded = 0

        for file_path in local_path.rglob("*"):
            if file_path.is_file():
                rel_path = file_path.relative_to(local_path)
                parent_parts = list(rel_path.parent.parts)

                uploaded = False
                for attempt in range(3):
                    try:
                        self.ftp.cwd(base_remote)
                        for part in parent_parts:
                            try:
                                self.ftp.cwd(part)
                            except ftplib.error_perm:
                                self.ftp.mkd(part)
                                self.ftp.cwd(part)

                        with open(file_path, "rb") as f:
                            self.ftp.storbinary(f"STOR {file_path.name}", f)
                        files_uploaded += 1
                        print(f"    -> Uploaded {rel_path} ({file_path.stat().st_size} bytes)")
                        uploaded = True
                        break
                    except Exception as e:
                        print(f"    [!] Failed to upload {rel_path} (attempt {attempt+1}/3): {e}")
                        time.sleep(1)
                        self.reconnect()

                if not uploaded:
                    print(f"    [-] Skipping {rel_path} after 3 failed attempts.")

        print(f"[SUCCESS] Uploaded {files_uploaded} files to {remote_dir}")
        try:
            self.ftp.cwd("/")
        except Exception:
            pass
        return True

    def update_htaccess(self):
        htaccess_file = Path("public/.htaccess")
        if htaccess_file.exists():
            print("\n[+] Updating /public_html/.htaccess for seamless beta routing...")
            for attempt in range(3):
                try:
                    self.ftp.cwd("/public_html")
                    with open(htaccess_file, "rb") as f:
                        self.ftp.storbinary("STOR .htaccess", f)
                    print("[SUCCESS] /public_html/.htaccess updated.")
                    break
                except Exception as e:
                    print(f"[-] Could not update .htaccess (attempt {attempt+1}/3): {e}")
                    self.reconnect()

    def close(self):
        try:
            if self.ftp:
                self.ftp.quit()
        except Exception:
            pass

def main():
    print("=" * 70)
    print("🚀 STEAM-Craft Subdomain & Beta Staging Multi-Deploy Engine")
    print("=" * 70)

    deployer = RobustFTPDeployer()

    # Prioritize SteamCraft Web App first so app.steamcraft.online is updated immediately
    deploy_targets = [
        # 1. SteamCraft Web App (app.steamcraft.online & public_html) - Priority #1
        ("dist", "/app.steamcraft.online"),
        ("dist", "/public_html"),
        ("dist", "/public_html/app"),

        # 2. Beta Staging Portal
        ("dist", "/beta.steamcraft.online"),
        ("dist", "/public_html/beta"),

        # 3. Subdomains
        ("deploy_subdomains/scholar", "/scholar.steamcraft.online"),
        ("deploy_subdomains/scholar", "/public_html/scholar"),
        ("deploy_subdomains/scholar", "/public_html/PaperAI"),

        ("deploy_subdomains/sim", "/sim.steamcraft.online"),
        ("deploy_subdomains/sim", "/public_html/sim"),

        ("deploy_subdomains/maker", "/maker.steamcraft.online"),
        ("deploy_subdomains/maker", "/public_html/maker"),

        ("deploy_subdomains/geo", "/geo.steamcraft.online"),
        ("deploy_subdomains/geo", "/public_html/geo"),

        ("deploy_subdomains/arena", "/arena.steamcraft.online"),
        ("deploy_subdomains/arena", "/public_html/arena"),
    ]

    for local_dir, remote_dir in deploy_targets:
        try:
            deployer.upload_folder(local_dir, remote_dir)
        except Exception as e:
            print(f"[!] Target {remote_dir} failed with unexpected error: {e}. Continuing next target...")

    deployer.update_htaccess()
    deployer.close()

    print("\n" + "=" * 70)
    print("🎉 All Subdomains & Beta Staging successfully synchronized!")
    print("=" * 70)

if __name__ == "__main__":
    main()

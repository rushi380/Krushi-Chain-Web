// Aptos configuration
        const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
        const MODULE_ADDRESS = "0x1"; // Replace with your deployed module address
        
        // Global state
        let landRecords = [];
        let blockchainData = [];
        let currentGuidance = '';
        let aptosClient = null;
        let walletConnected = false;
        let userAddress = '';

        // Initialize Aptos client
        function initializeAptos() {
            try {
                aptosClient = new Aptos.AptosApi(APTOS_NODE_URL);
                console.log("Aptos client initialized");
            } catch (error) {
                console.log("Aptos client simulation mode");
                aptosClient = { simulation: true };
            }
        }
       

        // Connect wallet
        async function connectWallet() {
            const statusDiv = document.getElementById('walletStatus');
            const infoDiv = document.getElementById('walletInfo');
            
            try {
                statusDiv.innerHTML = '<div class="loading"></div> Connecting to Aptos Wallet...';
                
                // Simulate wallet connection (in real app, use Aptos wallet adapter)
                setTimeout(() => {
                    walletConnected = true;
                    userAddress = '0x' + Math.random().toString(16).substr(2, 40);
                    
                    statusDiv.innerHTML = '✅ Wallet Connected';
                    infoDiv.innerHTML = `
                        <strong>Address:</strong> ${userAddress}<br>
                        <strong>Network:</strong> Aptos Testnet<br>
                        <strong>Balance:</strong> 100 APT
                    `;
                    infoDiv.style.display = 'block';
                    
                    // Enable buttons
                    document.getElementById('registerBtn').disabled = false;
                }, 2000);
                
            } catch (error) {
                statusDiv.innerHTML = '❌ Wallet connection failed';
                console.error('Wallet connection error:', error);
            }
        }

        // Show section
        function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            document.getElementById(sectionId).classList.add('active');
            event.target.classList.add('active');
        }

        // Register land on Aptos blockchain
        async function registerLandOnAptos() {
            if (!walletConnected) {
                alert('कृपया पहिले Aptos Wallet connect करा!');
                return;
            }

            const farmer = document.getElementById('farmerName').value;
            const area = document.getElementById('landArea').value;
            const crop = document.getElementById('cropType').value;
            const location = document.getElementById('location').value;

            if (!farmer || !area || !crop || !location) {
                alert('कृपया सर्व माहिती भरा!');
                return;
            }

            const landId = 'APTOS_LAND_' + Date.now();
            const registerBtn = document.getElementById('registerBtn');
            
            try {
                registerBtn.innerHTML = '<div class="loading"></div> Aptos वर नोंदणी होत आहे...';
                registerBtn.disabled = true;

                // Simulate Aptos transaction
                const txHash = await simulateAptosTransaction('register_land', {
                    land_id: landId,
                    farmer_name: farmer,
                    area: parseFloat(area),
                    crop_type: crop,
                    location: location
                });

                const landRecord = {
                    id: landId,
                    farmer,
                    area,
                    crop,
                    location,
                    timestamp: new Date().toLocaleString(),
                    aptosHash: txHash,
                    aptosAddress: userAddress,
                    network: 'Aptos Testnet'
                };

                landRecords.push(landRecord);
                
                // Add to Aptos blockchain
                addToAptosBlockchain('LAND_REGISTRATION', landRecord, txHash);

                // Clear form
                document.getElementById('farmerName').value = '';
                document.getElementById('landArea').value = '';
                document.getElementById('cropType').value = '';
                document.getElementById('location').value = '';

                // Show success and update UI
                displayLandRecords();
                generateQRCodes();
                
                document.getElementById('registeredLands').innerHTML = `
                    <div class="success-msg">
                        ✅ जमीन यशस्वीरित्या Aptos Blockchain वर नोंदणी झाली!<br>
                        Land ID: ${landId}<br>
                        <div class="aptos-tx">
                            <strong>Aptos Transaction Hash:</strong><br>
                            ${txHash}
                        </div>
                    </div>
                `;

                registerBtn.innerHTML = '🔗 Aptos Blockchain वर नोंदणी करा';
                registerBtn.disabled = false;

            } catch (error) {
                console.error('Aptos registration error:', error);
                alert('Registration failed: ' + error.message);
                registerBtn.innerHTML = '🔗 Aptos Blockchain वर नोंदणी करा';
                registerBtn.disabled = false;
            }
        }

        // Simulate Aptos transaction
        async function simulateAptosTransaction(functionName, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (aptosClient.simulation || !aptosClient.submitTransaction) {
                        // Simulate transaction hash
                        const txHash = '0x' + Math.random().toString(16).substr(2, 64);
                        resolve(txHash);
                    } else {
                        // Real Aptos transaction would go here
                        // const transaction = {
                        //     type: "entry_function_payload",
                        //     function: `${MODULE_ADDRESS}::krushi_chain::${functionName}`,
                        //     arguments: Object.values(payload),
                        //     type_arguments: []
                        // };
                        // resolve(aptosClient.submitTransaction(userAddress, transaction));
                        resolve('0x' + Math.random().toString(16).substr(2, 64));
                    }
                }, 1500);
            });
        }

        // Store sensor data on Aptos
        async function storeSensorDataOnAptos() {
            if (!walletConnected) {
                alert('कृपया पहिले Aptos Wallet connect करा!');
                return;
            }

            const sensorData = {
                temperature: document.getElementById('temperature').textContent,
                humidity: document.getElementById('humidity').textContent,
                soilMoisture: document.getElementById('soilMoisture').textContent,
                light: document.getElementById('light').textContent,
                timestamp: Date.now()
            };

            try {
                const txHash = await simulateAptosTransaction('store_sensor_data', sensorData);
                
                addToAptosBlockchain('SENSOR_DATA', sensorData, txHash);
                
                alert(`✅ Sensor data stored on Aptos!\nTransaction: ${txHash.substr(0, 20)}...`);
            } catch (error) {
                alert('Failed to store sensor data: ' + error.message);
            }
        }

        // Check subsidy on Aptos smart contract
        async function checkSubsidyOnAptos() {
            if (!walletConnected) {
                alert('कृपया पहिले Aptos Wallet connect करा!');
                return;
            }

            const result = document.getElementById('subsidyResult');
            result.innerHTML = '<div class="loading"></div> Aptos Smart Contract executing...';

            try {
                const eligible = Math.random() > 0.3; // 70% chance
                const amount = Math.floor(Math.random() * 50000) + 10000;
                
                const txHash = await simulateAptosTransaction('check_subsidy_eligibility', {
                    farmer_address: userAddress,
                    land_records: landRecords.length
                });

                if (eligible) {
                    // Simulate subsidy payment transaction
                    const paymentTxHash = await simulateAptosTransaction('transfer_subsidy', {
                        recipient: userAddress,
                        amount: amount
                    });

                    result.innerHTML = `
                        <div class="success-msg">
                            ✅ Aptos Smart Contract: अनुदानासाठी पात्र!<br>
                            रक्कम: ₹${amount}<br>
                            Move Contract executed successfully!
                            <div class="aptos-tx">
                                <strong>Eligibility Check:</strong><br>
                                ${txHash}<br><br>
                                <strong>Payment Transaction:</strong><br>
                                ${paymentTxHash}
                            </div>
                        </div>
                    `;
                    
                    addToAptosBlockchain('SUBSIDY_PAYMENT', {
                        amount: amount,
                        status: 'APPROVED',
                        recipient: userAddress
                    }, paymentTxHash);
                } else {
                    result.innerHTML = `
                        <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px;">
                            ❌ Aptos Smart Contract: सध्या अनुदानासाठी पात्र नाही<br>
                            <div class="aptos-tx">
                                <strong>Transaction Hash:</strong><br>
                                ${txHash}
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                result.innerHTML = '❌ Smart contract execution failed';
            }
        }

        // Display land records
        function displayLandRecords() {
            const container = document.getElementById('registeredLands');
            
            let html = '';
            landRecords.forEach(land => {
                html += `
                    <div class="land-card">
                        <h3>🌾 ${land.farmer} (${land.id})</h3>
                        <p><strong>क्षेत्र:</strong> ${land.area} एकर</p>
                        <p><strong>पीक:</strong> ${land.crop}</p>
                        <p><strong>स्थान:</strong> ${land.location}</p>
                        <div class="aptos-tx">
                            <strong>Aptos Hash:</strong> ${land.aptosHash}<br>
                            <strong>Owner:</strong> ${land.aptosAddress}
                        </div>
                        <small>नोंदणी: ${land.timestamp}</small>
                    </div>
                `;
            });
            container.innerHTML += html;
        }

        // Generate QR codes with Aptos verification
        function generateQRCodes() {
            const container = document.getElementById('qrCodes');
            container.innerHTML = '';
            
            landRecords.forEach(land => {
                const qrDiv = document.createElement('div');
                qrDiv.className = 'qr-container';
                qrDiv.innerHTML = `
                    <div class="land-card">
                        <h3>${land.farmer} - ${land.crop}</h3>
                        <div class="aptos-tx">⚡ Aptos Verified</div>
                        <canvas id="qr-${land.id}"></canvas>
                        <p>QR Code स्कॅन करा Aptos माहिती पाहण्यासाठी</p>
                        <button class="btn aptos-btn" onclick="scanQR('${land.id}')">📱 Aptos Verify करा</button>
                    </div>
                `;
                container.appendChild(qrDiv);

                // Generate QR code with Aptos data
                QRCode.toCanvas(document.getElementById(`qr-${land.id}`), JSON.stringify({
                    landId: land.id,
                    farmer: land.farmer,
                    crop: land.crop,
                    area: land.area,
                    location: land.location,
                    aptosHash: land.aptosHash,
                    aptosAddress: land.aptosAddress,
                    network: 'Aptos Testnet'
                }), { width: 200 });
            });
        }

        // Scan QR with Aptos verification
        function scanQR(landId) {
            const land = landRecords.find(l => l.id === landId);
            if (land) {
                alert(`🌾 Aptos Verified Land Information:\n\nFarmer: ${land.farmer}\nCrop: ${land.crop}\nArea: ${land.area} acres\nLocation: ${land.location}\n\n⚡ Aptos Blockchain:\nTransaction: ${land.aptosHash}\nOwner: ${land.aptosAddress}\nNetwork: ${land.network}`);
            }
        }

        // Simulate IoT data updates
        function updateSensorData() {
            document.getElementById('temperature').textContent = (25 + Math.random() * 10).toFixed(1) + '°C';
            document.getElementById('humidity').textContent = (50 + Math.random() * 30).toFixed(0) + '%';
            document.getElementById('soilMoisture').textContent = (30 + Math.random() * 40).toFixed(0) + '%';
            document.getElementById('light').textContent = (700 + Math.random() * 300).toFixed(0) + ' lux';
        }

        // Get AI guidance
        function getGuidance() {
            const temp = parseFloat(document.getElementById('temperature').textContent);
            const humidity = parseFloat(document.getElementById('humidity').textContent);
            const soil = parseFloat(document.getElementById('soilMoisture').textContent);

            let guidance = '';
            if (temp > 32) {
                guidance += '🌡️ तापमान जास्त आहे - पाणी देण्याची वेळ आली आहे।\n';
            }
            if (soil < 40) {
                guidance += '💧 मातीत पाणी कमी आहे - पाणी द्या।\n';
            }
            if (humidity > 80) {
                guidance += '🌿 आर्द्रता जास्त आहे - रोगांपासून बचाव करा।\n';
            }
            if (!guidance) {
                guidance = '✅ सर्व काही योग्य आहे! पिकाची चांगली वाढ होत आहे।';
            }

            currentGuidance = guidance;
            document.getElementById('guidance').innerHTML = `
                <div class="success-msg">
                    <h3>📢 AI शेतकरी मार्गदर्शन (Aptos Stored):</h3>
                    <pre>${guidance}</pre>
                </div>
            `;
        }

        // Speak guidance (simulation)
        function speakGuidance() {
            if (!currentGuidance) {
                getGuidance();
            }
            
            alert('🔊 मराठीत आवाज: "' + currentGuidance + '"');
            
            // Store on Aptos
            if (walletConnected) {
                simulateAptosTransaction('store_voice_guidance', {
                    guidance: currentGuidance,
                    timestamp: Date.now()
                }).then(txHash => {
                    addToAptosBlockchain('VOICE_GUIDANCE', {
                        guidance: currentGuidance,
                        timestamp: new Date().toLocaleString()
                    }, txHash);
                });
            }
        }

        // Add to Aptos blockchain
        function addToAptosBlockchain(type, data, txHash) {
            const block = {
                blockNumber: blockchainData.length + 1,
                type: type,
                data: data,
                timestamp: new Date().toLocaleString(),
                aptosHash: txHash,
                network: 'Aptos Testnet',
                gasUsed: Math.floor(Math.random() * 1000) + 100
            };
            
            blockchainData.push(block);
            updateBlockchainView();
        }

        // Update blockchain view
        function updateBlockchainView() {
            const container = document.getElementById('transactions');
            let html = `
                <div class="blockchain-record aptos-record">
                    <strong>Aptos Genesis Block</strong><br>
                    Network: Aptos Testnet<br>
                    Time: System Initialized<br>
                    Contract Deployed: ✅
                </div>
            `;
            
            blockchainData.forEach(block => {
                html += `
                    <div class="blockchain-record aptos-record">
                        <strong>Block #${block.blockNumber} - ${block.type}</strong><br>
                        <strong>Aptos Hash:</strong> ${block.aptosHash}<br>
                        <strong>Network:</strong> ${block.network}<br>
                        <strong>Gas Used:</strong> ${block.gasUsed}<br>
                        <strong>Time:</strong> ${block.timestamp}<br>
                        <strong>Data:</strong> ${JSON.stringify(block.data).substring(0, 80)}...
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // Initialize application
        function init() {
            initializeAptos();
            updateSensorData();
            setInterval(updateSensorData, 5000); // Update every 5 seconds
            
            // Disable register button until wallet is connected
            document.getElementById('registerBtn').disabled = true;
        }
        
        // Start the app
        init();
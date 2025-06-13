   // In-memory storage for the demo
        let students = [];
        let schools = new Set();

        // Load data from memory on page load
        window.addEventListener('load', function() {
            updateStats();
            displayStudents();
        });

        function showNotification(message, isError = false) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${isError ? 'error' : ''} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        function handleFileUpload(inputId, callback) {
            const input = document.getElementById(inputId);
            const file = input.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    callback(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }

        // Handle school logo upload
        document.getElementById('schoolLogo').addEventListener('change', function() {
            handleFileUpload('schoolLogo', function(src) {
                const logoElement = document.getElementById('previewLogo');
                logoElement.innerHTML = `<img src="${src}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            });
        });

        // Handle student photo upload
        document.getElementById('studentPhoto').addEventListener('change', function() {
            handleFileUpload('studentPhoto', function(src) {
                const photoElement = document.getElementById('previewPhoto');
                photoElement.innerHTML = `<img src="${src}">`;
            });
        });

        // Real-time preview updates
        document.getElementById('schoolName').addEventListener('input', function() {
            document.getElementById('previewSchoolName').textContent = this.value || 'School Name';
        });

        document.getElementById('schoolAddress').addEventListener('input', function() {
            document.getElementById('previewSchoolAddress').textContent = this.value || 'School Address';
        });

        document.getElementById('studentName').addEventListener('input', function() {
            document.getElementById('previewName').textContent = this.value || 'Student Name';
        });

        document.getElementById('studentId').addEventListener('input', function() {
            document.getElementById('previewId').textContent = this.value || '000000';
            document.getElementById('previewBarcode').textContent = `ID: ${this.value || '000000'}`;
        });

        document.getElementById('grade').addEventListener('change', function() {
            document.getElementById('previewGrade').textContent = this.value || '-';
        });

        document.getElementById('section').addEventListener('input', function() {
            document.getElementById('previewSection').textContent = this.value || '-';
        });

        document.getElementById('rollNumber').addEventListener('input', function() {
            document.getElementById('previewRoll').textContent = this.value || '-';
        });

        document.getElementById('dateOfBirth').addEventListener('change', function() {
            if (this.value) {
                const date = new Date(this.value);
                const formatted = date.toLocaleDateString();
                document.getElementById('previewDob').textContent = formatted;
            } else {
                document.getElementById('previewDob').textContent = '-';
            }
        });

        document.getElementById('bloodGroup').addEventListener('change', function() {
            document.getElementById('previewBlood').textContent = this.value || '-';
        });

        function validateForm() {
            const requiredFields = ['schoolName', 'studentName', 'studentId', 'grade', 'dateOfBirth'];
            
            for (let field of requiredFields) {
                const element = document.getElementById(field);
                if (!element.value.trim()) {
                    showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, true);
                    element.focus();
                    return false;
                }
            }
            
            return true;
        }

        function generateCard() {
            if (!validateForm()) {
                return;
            }

            const studentData = {
                id: Date.now().toString(), // Simple ID generation
                schoolName: document.getElementById('schoolName').value,
                schoolAddress: document.getElementById('schoolAddress').value,
                studentName: document.getElementById('studentName').value,
                studentId: document.getElementById('studentId').value,
                grade: document.getElementById('grade').value,
                section: document.getElementById('section').value,
                rollNumber: document.getElementById('rollNumber').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                bloodGroup: document.getElementById('bloodGroup').value,
                photoUrl: document.getElementById('previewPhoto').innerHTML.includes('img') ? 
                          document.getElementById('previewPhoto').querySelector('img').src : null,
                logoUrl: document.getElementById('previewLogo').innerHTML.includes('img') ? 
                         document.getElementById('previewLogo').querySelector('img').src : null,
                createdAt: new Date().toISOString()
            };

            // Check for duplicate student ID
            if (students.some(student => student.studentId === studentData.studentId)) {
                showNotification('Student ID already exists! Please use a unique ID.', true);
                return;
            }

            // Store student data
            students.push(studentData);
            schools.add(studentData.schoolName);

            showNotification('Student ID card generated successfully! 🎉');
            updateStats();
            displayStudents();
        }

        function updateStats() {
            document.getElementById('totalStudents').textContent = students.length;
            document.getElementById('totalSchools').textContent = schools.size;
        }

        function displayStudents() {
            const container = document.getElementById('studentsList');
            
            if (students.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px;">No students registered yet. Create your first ID card!</p>';
                return;
            }

            const studentsHtml = students.map(student => `
                <div class="student-item">
                    <div>
                        <strong>${student.studentName}</strong> (ID: ${student.studentId})<br>
                        <small>${student.schoolName} - Grade ${student.grade}${student.section ? student.section : ''}</small>
                    </div>
                    <div>
                        <button class="delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
                        <button class="btn" onclick="loadStudent('${student.id}')" style="padding: 5px 10px; font-size: 12px; margin-left: 5px;">Load</button>
                    </div>
                </div>
            `).join('');

            container.innerHTML = studentsHtml;
        }

        function deleteStudent(studentId) {
            if (confirm('Are you sure you want to delete this student?')) {
                students = students.filter(student => student.id !== studentId);
                
                // Update schools set
                schools.clear();
                students.forEach(student => schools.add(student.schoolName));
                
                updateStats();
                displayStudents();
                showNotification('Student deleted successfully!');
            }
        }

        function loadStudent(studentId) {
            const student = students.find(s => s.id === studentId);
            if (!student) return;

            // Fill form with student data
            document.getElementById('schoolName').value = student.schoolName;
            document.getElementById('schoolAddress').value = student.schoolAddress;
            document.getElementById('studentName').value = student.studentName;
            document.getElementById('studentId').value = student.studentId;
            document.getElementById('grade').value = student.grade;
            document.getElementById('section').value = student.section;
            document.getElementById('rollNumber').value = student.rollNumber;
            document.getElementById('dateOfBirth').value = student.dateOfBirth;
            document.getElementById('bloodGroup').value = student.bloodGroup;

            // Update preview
            document.getElementById('previewSchoolName').textContent = student.schoolName;
            document.getElementById('previewSchoolAddress').textContent = student.schoolAddress;
            document.getElementById('previewName').textContent = student.studentName;
            document.getElementById('previewId').textContent = student.studentId;
            document.getElementById('previewGrade').textContent = student.grade;
            document.getElementById('previewSection').textContent = student.section || '-';
            document.getElementById('previewRoll').textContent = student.rollNumber || '-';
            document.getElementById('previewDob').textContent = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-';
            document.getElementById('previewBlood').textContent = student.bloodGroup || '-';
            document.getElementById('previewBarcode').textContent = `ID: ${student.studentId}`;

            // Load images if available
            if (student.photoUrl) {
                document.getElementById('previewPhoto').innerHTML = `<img src="${student.photoUrl}">`;
            }
            if (student.logoUrl) {
                document.getElementById('previewLogo').innerHTML = `<img src="${student.logoUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            }

            showNotification('Student data loaded successfully!');
        }

        function downloadCard() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size (300x450 scaled up for better quality)
            canvas.width = 600;
            canvas.height = 900;
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            
            ctx.fillStyle = gradient;  
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add rounded corners effect
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.roundRect(0, 0, canvas.width, canvas.height, 30);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            
            // Function to draw images and text
            function drawCardContent() {
                // Add white semi-transparent background for better text visibility
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                
                // School logo area
                const logoElement = document.getElementById('previewLogo');
                const logoImg = logoElement.querySelector('img');
                
                if (logoImg) {
                    const logoCanvas = new Image();
                    logoCanvas.onload = function() {
                        // Draw circular logo
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(canvas.width/2, 100, 60, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.drawImage(logoCanvas, canvas.width/2 - 60, 40, 120, 120);
                        ctx.restore();
                        
                        continueDrawing();
                    };
                    logoCanvas.src = logoImg.src;
                } else {
                    // Draw default logo circle
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.arc(canvas.width/2, 100, 60, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = 'white';
                    ctx.font = '48px Arial';
                    ctx.fillText('🏫', canvas.width/2, 115);
                    
                    continueDrawing();
                }
            }
            
            function continueDrawing() {
                ctx.fillStyle = 'white';
                
                // School name
                ctx.font = 'bold 32px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(document.getElementById('previewSchoolName').textContent, canvas.width/2, 200);
                
                // School address
                ctx.font = '20px Arial';
                const address = document.getElementById('previewSchoolAddress').textContent;
                if (address.length > 40) {
                    const lines = address.match(/.{1,40}(\s|$)/g) || [address];
                    lines.forEach((line, index) => {
                        ctx.fillText(line.trim(), canvas.width/2, 230 + (index * 25));
                    });
                } else {
                    ctx.fillText(address, canvas.width/2, 230);
                }
                
                // Student photo area
                const photoElement = document.getElementById('previewPhoto');
                const photoImg = photoElement.querySelector('img');
                
                if (photoImg) {
                    const studentPhoto = new Image();
                    studentPhoto.onload = function() {
                        // Draw student photo with rounded corners
                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(canvas.width/2 - 100, 280, 200, 240, 20);
                        ctx.clip();
                        ctx.drawImage(studentPhoto, canvas.width/2 - 100, 280, 200, 240);
                        ctx.restore();
                        
                        finishDrawing();
                    };
                    studentPhoto.src = photoImg.src;
                } else {
                    // Draw default photo placeholder
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(canvas.width/2 - 100, 280, 200, 240);
                    
                    ctx.fillStyle = 'white';
                    ctx.font = '48px Arial';
                    ctx.fillText('📷', canvas.width/2, 420);
                    
                    finishDrawing();
                }
            }
            
            function finishDrawing() {
                // Student info
                ctx.fillStyle = 'white';
                ctx.textAlign = 'left';
                ctx.font = 'bold 22px Arial';
                
                const studentInfo = [
                    { label: 'Name:', value: document.getElementById('previewName').textContent },
                    { label: 'ID:', value: document.getElementById('previewId').textContent },
                    { label: 'Grade:', value: document.getElementById('previewGrade').textContent },
                    { label: 'Section:', value: document.getElementById('previewSection').textContent },
                    { label: 'Roll:', value: document.getElementById('previewRoll').textContent },
                    { label: 'DOB:', value: document.getElementById('previewDob').textContent },
                    { label: 'Blood:', value: document.getElementById('previewBlood').textContent }
                ];
                
                let yPosition = 560;
                studentInfo.forEach(info => {
                    ctx.font = 'bold 18px Arial';
                    ctx.fillText(info.label, 50, yPosition);
                    ctx.font = '18px Arial';
                    ctx.fillText(info.value, 150, yPosition);
                    yPosition += 35;
                });
                
                // Add barcode area
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(50, 800, canvas.width - 100, 60);
                
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.font = '16px monospace';
                ctx.fillText(document.getElementById('previewBarcode').textContent, canvas.width/2, 835);
                
                // Add decorative barcode lines
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                for (let i = 0; i < 20; i++) {
                    const x = 60 + (i * 25);
                    const height = Math.random() * 20 + 20;
                    ctx.beginPath();
                    ctx.moveTo(x, 810);
                    ctx.lineTo(x, 810 + height);
                    ctx.stroke();
                }
                
                // Download the canvas as image
                const link = document.createElement('a');
                link.download = `${document.getElementById('previewName').textContent}_ID_Card.png`;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
                
                showNotification('ID Card downloaded successfully with images! 📸');
            }
            
            // Start the drawing process
            drawCardContent();
        }

        // Add some sample data for demonstration
        setTimeout(() => {
            if (students.length === 0) {
                // Add sample student
                const sampleStudent = {
                    id: '1',
                    schoolName: 'Greenwood High School',
                    schoolAddress: '123 Education St, Knowledge City',
                    studentName: 'John Doe',
                    studentId: 'GHS2024001',
                    grade: '10th',
                    section: 'A',
                    rollNumber: '15',
                    dateOfBirth: '2008-05-15',
                    bloodGroup: 'O+',
                    photoUrl: null,
                    logoUrl: null,
                    createdAt: new Date().toISOString()
                };
                
                students.push(sampleStudent);
                schools.add(sampleStudent.schoolName);
                updateStats();
                displayStudents();
            }
        }, 1000);
document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const cardPhoto = document.getElementById('cardPhoto');
    const memberForm = document.getElementById('memberForm');

    // Inputs
    const inName = document.getElementById('inName');
    const inPhone = document.getElementById('inPhone');
    const inDistrict = document.getElementById('inDistrict');
    const inArea = document.getElementById('inArea');
    const inDOB = document.getElementById('inDOB');
    const inGender = document.getElementById('inGender');
    const inUnion = document.getElementById('inUnion');
    const inBooth = document.getElementById('inBooth');
    const inVoter = document.getElementById('inVoter');

    // Preview Elements
    const cardName = document.getElementById('cardName');
    const cardDistrict = document.getElementById('cardDistrict');
    const cardArea = document.getElementById('cardArea');
    const cardDOB = document.getElementById('cardDOB');
    const cardID = document.getElementById('cardID');
    const cardQR = document.getElementById('cardQR');

    const downloadBtn = document.getElementById('downloadBtn');
    const previewBtn = document.getElementById('previewBtn');

    // Initialize Modal
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));

    // 1. Photo Upload Handler (Updated for Dropzone)
    photoInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.classList.remove('d-none');
                cardPhoto.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // 2. Live Preview Logic
    const updatePreview = () => {
        cardName.innerText = inName.value || "MEMBER NAME";
        cardDistrict.innerText = inDistrict.value || "Erode";
        cardArea.innerText = inArea.value || "---";

        // Format Date for Display
        if (inDOB.value) {
            const date = new Date(inDOB.value);
            cardDOB.innerText = date.toLocaleDateString('ta-IN');
        } else {
            cardDOB.innerText = "---";
        }
    };

    [inName, inPhone, inDistrict, inArea, inDOB, inUnion, inBooth].forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // 3. Generate Random Member ID
    const generateID = () => {
        const num = Math.floor(100000 + Math.random() * 900000);
        const mid = `PMK-ANT-${num}`;
        const ids = document.querySelectorAll('#cardID');
        ids.forEach(el => el.innerText = mid);

        // Update QR Code
        cardQR.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${mid}`;
    };

    generateID(); // Generate initial ID

    // 4. Preview Button Logic
    previewBtn.addEventListener('click', () => {
        if (!memberForm.checkValidity()) {
            memberForm.reportValidity();
            return;
        }

        // --- Duplicate Voter ID Checking Logic ---
        const currentVoterID = inVoter.value.trim().toUpperCase();
        const registeredVoters = JSON.parse(localStorage.getItem('pmk_voters_list') || '[]');

        if (registeredVoters.includes(currentVoterID)) {
            alert('இந்த வாக்காளர் அடையாள அட்டை எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது! (This Voter ID is already registered!)');
            // Add a visual error state to the input
            inVoter.classList.add('is-invalid');
            inVoter.focus();
            return;
        }
        inVoter.classList.remove('is-invalid');

        // --- Store Data in Intranet (localStorage) as soon as created ---
        const registeredMembers = JSON.parse(localStorage.getItem('pmk_members_data') || '[]');
        const registeredVoterIDs = JSON.parse(localStorage.getItem('pmk_voters_list') || '[]');

        if (!registeredVoterIDs.includes(currentVoterID)) {
            const newMember = {
                name: inName.value.trim(),
                phone: inPhone.value.trim(),
                area: inArea.value.trim(),
                ward: inArea.value.trim(),
                voterID: currentVoterID,
                district: inDistrict.value.trim(),
                timestamp: new Date().toLocaleString('ta-IN')
            };

            registeredMembers.push(newMember);
            registeredVoterIDs.push(currentVoterID);

            localStorage.setItem('pmk_members_data', JSON.stringify(registeredMembers));
            localStorage.setItem('pmk_voters_list', JSON.stringify(registeredVoterIDs));
            console.log('Member stored in intranet successfully!');
        }

        // Force an update right before showing
        updatePreview();
        previewModal.show();
    });

    // 5. Download Feature using html2canvas
    downloadBtn.addEventListener('click', () => {
        const frontCard = document.getElementById('cardFront');

        // Show loading state
        const originalBtnText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>பதிவிறக்கம் செய்கிறது...';
        downloadBtn.disabled = true;

        // html2canvas capture logic
        html2canvas(frontCard, {
            useCORS: true,
            scale: 3, // High quality
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a');
            const fileName = `PMK_Member_${inName.value.trim().replace(/\s+/g, '_') || 'Card'}.png`;
            link.download = fileName;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Restore button
            downloadBtn.innerHTML = originalBtnText;
            downloadBtn.disabled = false;
        }).catch(err => {
            console.error('Canvas Error:', err);
            alert('Identity Card உருவாக்கத்தில் தோல்வி ஏற்பட்டது. (Download Failed).');
            downloadBtn.innerHTML = originalBtnText;
            downloadBtn.disabled = false;
        });
    });
});
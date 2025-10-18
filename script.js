// Get all necessary elements
const agreeButton = document.getElementById('agreeButton');
// Updated to target the new modal's show function
const declineButton = document.getElementById('declineButton'); 
const detailsLink = document.getElementById('detailsLink');
const backButton = document.getElementById('backButton');

const scanBackButton = document.getElementById('scanBackButton');
const imReadyButton = document.getElementById('imReadyButton'); 

// 4th Screen elements (ID Check)
const fourthScreen = document.getElementById('fourthScreen'); 
const shutterButton = document.getElementById('shutterButton'); 
const idCaptureTitle = document.getElementById('idCaptureTitle'); 
const idCaptureInstructions = document.getElementById('idCaptureInstructions'); 
const havingTroubleLink = document.getElementById('havingTroubleLink');
const videoElement = document.getElementById('videoElement'); 
const progressBar = document.getElementById('progressBar');   

// 5th Screen elements (Selfie Check)
const fifthScreen = document.getElementById('fifthScreen'); 
const selfieShutterButton = document.getElementById('selfieShutterButton');
const selfieVideoElement = document.getElementById('selfieVideoElement');
const selfieTroubleLink = document.getElementById('selfieTroubleLink');

// 6th Screen elements (Success/Redirect)
const sixthScreen = document.getElementById('sixthScreen');
const countdownElement = document.getElementById('countdown');

// 7th Screen elements (Decline Confirmation) (NEW)
const seventhModal = document.getElementById('seventhModal');
const confirmCancelButton = document.getElementById('confirmCancelButton');
const continueVerificationButton = document.getElementById('continueVerificationButton');

const firstModal = document.getElementById('firstModal');
const secondModal = document.getElementById('secondModal');
const thirdScreen = document.getElementById('thirdScreen');

let isFrontOfID = true; 
let cameraStream = null; 
let redirectTimer = null; // To hold the countdown interval


// Function to handle clicks that lead nowhere
function handleButtonClick(event) {
    event.preventDefault(); 
    console.log(`Button or Link '${event.target.id}' was clicked. No further action is executed.`);
}

// === Camera Functions (No change here, omitted for brevity) ===
// ... startCamera() and stopCamera() logic remains the same ...

// Start the camera feed, attaching it to the correct video element
async function startCamera(videoTarget) {
    if (cameraStream) stopCamera();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream = stream;
        videoTarget.srcObject = stream;
        videoTarget.play();
        console.log("Camera stream started.");
    } catch (err) {
        console.error("Error accessing the camera: ", err);
        if (videoTarget === videoElement) {
            idCaptureInstructions.textContent = "Error: Could not access the camera. Please check permissions.";
        } else if (videoTarget === selfieVideoElement) {
            document.querySelector('.selfie-modal .instruction-text').textContent = "Error: Could not access the camera. Please check permissions.";
        }
    }
}

// Stop the camera feed
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        if (videoElement) videoElement.srcObject = null;
        if (selfieVideoElement) selfieVideoElement.srcObject = null;
        console.log("Camera stream stopped.");
    }
}

// === Modal/Screen Switching Functions ===

// Hide All Helper
function hideAllModals() {
    firstModal.classList.add('hidden');
    secondModal.classList.add('hidden');
    thirdScreen.classList.add('hidden');
    fourthScreen.classList.add('hidden');
    fifthScreen.classList.add('hidden');
    sixthScreen.classList.add('hidden');
    seventhModal.classList.add('hidden'); // NEW: Include 7th modal
    stopCamera();
    if (redirectTimer) clearInterval(redirectTimer); 
}

// 1. Show the second modal
function showSecondModal(event) {
    event.preventDefault(); 
    hideAllModals();
    secondModal.classList.remove('hidden');
}

// 2. Hide the second modal and show the first
function showFirstModal(event) {
    event.preventDefault(); 
    hideAllModals();
    firstModal.classList.remove('hidden');
}

// 3. Show the third screen
function showThirdScreen(event) {
    event.preventDefault();
    hideAllModals();
    thirdScreen.classList.remove('hidden');
}

// 4. Hide the third screen and show the first (used for return/cancel)
function returnToFirstModal(event) {
    event.preventDefault();
    hideAllModals();
    firstModal.classList.remove('hidden');
}

// 5. Show the fourth screen (ID Capture)
function showFourthScreen(event) {
    event.preventDefault();
    hideAllModals();
    fourthScreen.classList.remove('hidden'); 
    
    isFrontOfID = true; 
    updateIDCaptureScreen(); 
    startCamera(videoElement); 
}

// 6. Show the fifth screen (Selfie Check)
function showFifthScreen() {
    hideAllModals();
    fifthScreen.classList.remove('hidden');
    startCamera(selfieVideoElement);
    console.log("Moved to Selfie Screen.");
}

// 7. Show the sixth screen (Success/Redirect)
function showSixthScreen() {
    hideAllModals();
    sixthScreen.classList.remove('hidden');
    startRedirectCountdown(5);
}

// 8. Show the seventh modal (Decline Confirmation) (NEW)
function showDeclineModal(event) {
    event.preventDefault(); 
    hideAllModals();
    seventhModal.classList.remove('hidden');
}

// Handler for "Continue Verification" button in the Decline modal (NEW)
function returnToVerification(event) {
    event.preventDefault();
    hideAllModals();
    firstModal.classList.remove('hidden'); // Go back to the initial screen
}

// Handler for "Cancel Reservation" button in the Decline modal (NEW)
function confirmCancel(event) {
    event.preventDefault();
    // In a real application, this would trigger a backend process to cancel the reservation.
    console.log("Reservation explicitly canceled by user.");
    // For this simulation, we'll simply close the modal and leave the screen blank/static
    hideAllModals(); 
}

// Toggle between "Front of ID" and "Back of ID"
function toggleIDCaptureState(event) {
    event.preventDefault(); 
    
    if (isFrontOfID) {
        isFrontOfID = false; 
        updateIDCaptureScreen();
    } else {
        isFrontOfID = true; 
        console.log("Back of ID captured. Moving to Selfie Check.");
        showFifthScreen(); 
    }
}

// Capture Selfie and initiate redirect
function captureSelfie() {
    console.log("Selfie captured. Moving to Success screen.");
    stopCamera(); 
    showSixthScreen();
}

// Update text and progress bar based on current state (omitted for brevity)
function updateIDCaptureScreen() {
    if (idCaptureTitle && idCaptureInstructions && progressBar) {
        if (isFrontOfID) {
            idCaptureTitle.textContent = "Front of ID";
            idCaptureInstructions.textContent = "Hold the ID in front of your camera in a well-lit area and press the spacebar key or click the shutter.";
            progressBar.style.width = '50%'; 
        } else {
            idCaptureTitle.textContent = "Back of ID";
            idCaptureInstructions.textContent = "Now, flip the ID and hold the back in front of your camera, then click the shutter.";
            progressBar.style.width = '100%'; 
        }
    }
}

// Start the 5-second redirect countdown
function startRedirectCountdown(seconds) {
    let count = seconds;
    countdownElement.textContent = count;

    redirectTimer = setInterval(() => {
        count--;
        countdownElement.textContent = count;

        if (count <= 0) {
            clearInterval(redirectTimer);
            console.log("Redirecting to payment page...");
            window.location.href = "https://pay.lamaisonblanche.ca";
        }
    }, 1000); 
}


// === Event Listeners ===

// First Modal Actions
if (agreeButton) { agreeButton.addEventListener('click', showThirdScreen); }
// UPDATED: Decline now shows the confirmation modal
if (declineButton) { declineButton.addEventListener('click', showDeclineModal); } 
if (detailsLink) { detailsLink.addEventListener('click', showSecondModal); }

// Second Modal Actions
if (backButton) { backButton.addEventListener('click', showFirstModal); }

// Third Screen Actions
if (scanBackButton) { scanBackButton.addEventListener('click', returnToFirstModal); }
if (imReadyButton) { imReadyButton.addEventListener('click', showFourthScreen); }

// Fourth Screen Actions (ID Check)
if (shutterButton) { shutterButton.addEventListener('click', toggleIDCaptureState); }
if (havingTroubleLink) { havingTroubleLink.addEventListener('click', handleButtonClick); }

// Fifth Screen Actions (Selfie Check)
if (selfieShutterButton) { selfieShutterButton.addEventListener('click', captureSelfie); }
if (selfieTroubleLink) { selfieTroubleLink.addEventListener('click', handleButtonClick); }

// Seventh Modal Actions (Decline Confirmation) (NEW)
if (continueVerificationButton) { continueVerificationButton.addEventListener('click', returnToVerification); }


// Global listener for spacebar press (No change required, as the 7th modal is not camera-related)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); 
        
        if (fourthScreen && !fourthScreen.classList.contains('hidden')) {
            toggleIDCaptureState(event);
        } else if (fifthScreen && !fifthScreen.classList.contains('hidden')) {
            captureSelfie(event);
        }
    }
});
const agreeButton = document.getElementById('agreeButton');
const declineButton = document.getElementById('declineButton'); 
const detailsLink = document.getElementById('detailsLink');
const backButton = document.getElementById('backButton');
const scanBackButton = document.getElementById('scanBackButton');
const imReadyButton = document.getElementById('imReadyButton'); 
const fourthScreen = document.getElementById('fourthScreen'); 
const shutterButton = document.getElementById('shutterButton'); 
const idCaptureTitle = document.getElementById('idCaptureTitle'); 
const idCaptureInstructions = document.getElementById('idCaptureInstructions'); 
const havingTroubleLink = document.getElementById('havingTroubleLink');
const videoElement = document.getElementById('videoElement'); 
const progressBar = document.getElementById('progressBar');   
const fifthScreen = document.getElementById('fifthScreen'); 
const selfieShutterButton = document.getElementById('selfieShutterButton');
const selfieVideoElement = document.getElementById('selfieVideoElement');
const selfieTroubleLink = document.getElementById('selfieTroubleLink');
const sixthScreen = document.getElementById('sixthScreen');
const countdownElement = document.getElementById('countdown');
const seventhModal = document.getElementById('seventhModal');
const confirmCancelButton = document.getElementById('confirmCancelButton');
const continueVerificationButton = document.getElementById('continueVerificationButton');
const firstModal = document.getElementById('firstModal');
const secondModal = document.getElementById('secondModal');
const thirdScreen = document.getElementById('thirdScreen');

let isFrontOfID = true; 
let cameraStream = null; 
let redirectTimer = null;

function handleButtonClick(event) {
    event.preventDefault(); 
    console.log(`Button or Link '${event.target.id}' was clicked. No further action is executed.`);
}
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

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        if (videoElement) videoElement.srcObject = null;
        if (selfieVideoElement) selfieVideoElement.srcObject = null;
        console.log("Camera stream stopped.");
    }
}

function hideAllModals() {
    firstModal.classList.add('hidden');
    secondModal.classList.add('hidden');
    thirdScreen.classList.add('hidden');
    fourthScreen.classList.add('hidden');
    fifthScreen.classList.add('hidden');
    sixthScreen.classList.add('hidden');
    seventhModal.classList.add('hidden');
    stopCamera();
    if (redirectTimer) clearInterval(redirectTimer); 
}

function showSecondModal(event) {
    event.preventDefault(); 
    hideAllModals();
    secondModal.classList.remove('hidden');
}

function showFirstModal(event) {
    event.preventDefault(); 
    hideAllModals();
    firstModal.classList.remove('hidden');
}

function showThirdScreen(event) {
    event.preventDefault();
    hideAllModals();
    thirdScreen.classList.remove('hidden');
}

function returnToFirstModal(event) {
    event.preventDefault();
    hideAllModals();
    firstModal.classList.remove('hidden');
}

function showFourthScreen(event) {
    event.preventDefault();
    hideAllModals();
    fourthScreen.classList.remove('hidden'); 
    
    isFrontOfID = true; 
    updateIDCaptureScreen(); 
    startCamera(videoElement); 
}

function showFifthScreen() {
    hideAllModals();
    fifthScreen.classList.remove('hidden');
    startCamera(selfieVideoElement);
    console.log("Moved to Selfie Screen.");
}

function showSixthScreen() {
    hideAllModals();
    sixthScreen.classList.remove('hidden');
    startRedirectCountdown(5);
}

function showDeclineModal(event) {
    event.preventDefault(); 
    hideAllModals();
    seventhModal.classList.remove('hidden');
}

function returnToVerification(event) {
    event.preventDefault();
    hideAllModals();
    firstModal.classList.remove('hidden');
}

function confirmCancel(event) {
    event.preventDefault();
    console.log("Reservation explicitly canceled by user.");
    hideAllModals(); 
}

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

function captureSelfie() {
    console.log("Selfie captured. Moving to Success screen.");
    stopCamera(); 
    showSixthScreen();
}

function updateIDCaptureScreen() {
    if (idCaptureTitle && idCaptureInstructions && progressBar) {
        if (isFrontOfID) {
            idCaptureTitle.textContent = "Front of ID";
            idCaptureInstructions.textContent = "Hold the ID in front of your camera in a well-lit area and click the shutter.";
            progressBar.style.width = '50%'; 
        } else {
            idCaptureTitle.textContent = "Back of ID";
            idCaptureInstructions.textContent = "Now, flip the ID and hold the back in front of your camera, then click the shutter.";
            progressBar.style.width = '100%'; 
        }
    }
}

function startRedirectCountdown(seconds) {
    let count = seconds;
    countdownElement.textContent = count;

    redirectTimer = setInterval(() => {
        count--;
        countdownElement.textContent = count;

        if (count <= 0) {
            clearInterval(redirectTimer);
            console.log("Redirecting to payment page...");
            window.location.href = "https://pay.lamaisonblanche.ca/en";
        }
    }, 1000); 
}

if (agreeButton) { agreeButton.addEventListener('click', showThirdScreen); }
if (declineButton) { declineButton.addEventListener('click', showDeclineModal); } 
if (detailsLink) { detailsLink.addEventListener('click', showSecondModal); }
if (backButton) { backButton.addEventListener('click', showFirstModal); }
if (scanBackButton) { scanBackButton.addEventListener('click', returnToFirstModal); }
if (imReadyButton) { imReadyButton.addEventListener('click', showFourthScreen); }
if (shutterButton) { shutterButton.addEventListener('click', toggleIDCaptureState); }
if (havingTroubleLink) { havingTroubleLink.addEventListener('click', handleButtonClick); }
if (selfieShutterButton) { selfieShutterButton.addEventListener('click', captureSelfie); }
if (selfieTroubleLink) { selfieTroubleLink.addEventListener('click', handleButtonClick); }
if (continueVerificationButton) { continueVerificationButton.addEventListener('click', returnToVerification); }

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
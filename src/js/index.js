// 챌린지 설정(수정)하기 모달창 띄우기
const settingBtn = document.querySelector(".setting-btn");
const settingModal = document.querySelector(".setting-modal");
const cancelBtn = settingModal.querySelector(".cancel-btn");

settingBtn.addEventListener("click", function() {
    settingModal.classList.add("active");
});

if(cancelBtn){
    cancelBtn.addEventListener("click", function() {
        settingModal.classList.remove("active");
    });
}

window.onclick = function(e) {
    if(settingModal) {
        if(e.target == settingModal) {
            settingModal.classList.remove("active");
          }
    }
};

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

function init() {
    if (!localStorage.getItem("habitChallengeData")){
        console.log("생성됨");
        defaultData = {};
        [...Array(30)].forEach((k,i)=>{
            defaultData[i+1] = 0
        })
        
        localStorage.setItem("habitChallengeData", JSON.stringify({
            title:"제목을 설정해주세요",
            data:defaultData
        }))
    }
    
    const successList = JSON.parse(localStorage.getItem("habitChallengeData"))
    console.log(successList.data);
    
    const app = document.getElementsByClassName("table-item-wrap")[0]
    app.innerHTML=""
    console.log(app);
    for (const key in successList.data) {
        if (Object.hasOwnProperty.call(successList.data, key)) {
            const stamp = successList.data[key];
            const el = document.createElement("div");
            el.className = "table-item";
            el.innerHTML = key
            el.setAttribute('data-value', stamp)
            app.appendChild(el)
        }
    }
}

init()
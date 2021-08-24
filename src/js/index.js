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

// 모달창 닫기
window.onclick = function(e) {
    if(settingModal) {
        if(e.target == settingModal) {
            settingModal.classList.remove("active");
        }
    }
};

function init() {
    if (!localStorage.getItem("habitChallengeData")){
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
    for (const key in successList.data) {
        if (Object.hasOwnProperty.call(successList.data, key)) {
            const stamp = successList.data[key];
            const el = document.createElement("div");
            el.className = "table-item";
            el.id = `item${key}`
            el.innerHTML = key
            el.setAttribute('data-value', stamp)
            app.appendChild(el)
        }
    }
}

init()

// 스티커 추가 이벤트
const challengeTable = document.querySelector(".challenge-table");
const tableItem = document.querySelectorAll(".table-item");
const selectSticker = document.querySelector(".select-sticker");

tableItem.forEach((item, idx) => {
    item.addEventListener("click", function(){
        const activeTableItem = challengeTable.querySelector(".selected");

        if(item.classList.contains("selected")){
            item.classList.remove("selected");
            selectSticker.classList.remove("active");
        } else {
            if(activeTableItem){
                activeTableItem.classList.remove("selected");
            }
            item.classList.add("selected");
            selectSticker.classList.add("active");
            stickerStyle(idx, item);
        }

        window.onclick = function(e) {
            if(e.target != item) {
                item.classList.remove("selected");
                selectSticker.classList.remove("active");
            }
        };
    });
});



// 스티커 선택창 스타일 변경
// tableItem를 클릭할 때마다 스티커 선택창 위치가 변경됨.
function stickerStyle(i, e){
    // margin 값을 포함한 tableItem의 width값
    const tableItemWidth = e.offsetWidth + parseInt(window.getComputedStyle(e).getPropertyValue("margin-bottom"), 10);

    const index = i%5;

    selectSticker.style.top = `${tableItemWidth+e.offsetTop}px`;

    if(index >= 1) {
        selectSticker.style.left = `${tableItem[1].offsetLeft}px`;
    } else {
        selectSticker.style.left = `${e.offsetLeft}px`;
    }
}

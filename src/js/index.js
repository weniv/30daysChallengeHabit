// 챌린지 설정(수정)하기 모달창 띄우기
const settingBtn = document.querySelector(".setting-btn");
const settingModal = document.querySelector(".setting-modal");
const cancelBtn = settingModal.querySelector(".cancel-btn");
const stickers = document.querySelectorAll(".sticker");
const setBtn = document.querySelector(".set-btn");
const progressBar = document.querySelector(".progress-bar");
const app = document.getElementsByClassName("table-item-wrap")[0];
let selectedItem;
let appData = {}

window.addEventListener("keydown",function(e) {
    if(e.keyCode===13){
        e.preventDefault()
    }
})


setBtn.addEventListener("click", setChallenge)
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


function createDom(dom="div",id="",className="", child="") {
    const el = document.createElement(dom);

    el.className = className;
    el.id=id;
    el.append(child);
    return el
}
function progressCheck() {
    const items = document.getElementsByClassName("table-item");
    let count = 0;
    [...items].forEach(item => {
        count += item.dataset.value<4 ? 1 : 0
    });
    progressBar.style.width = `${count/items.length*100}%`
}
function saveAppData() {
    localStorage.setItem("habitChallengeData", JSON.stringify(appData))
    progressCheck()
}

//일정에 도장찍기
function setSticker(idx) {
    const selectedDom = document.getElementById(`item${selectedItem+1}`)
    console.log(selectedDom.dataset.value);
    selectedDom.dataset.value = idx
    selectedDom.innerHTML=""
    const sticker = stickers[idx].cloneNode()
    selectedDom.append(sticker)
    appData['data'][selectedItem+1] = idx
    saveAppData()
}


//챌린지 설정
function setChallenge() {
    const challengeSetting = new FormData(document.getElementById("setChallengeForm"))
    const datas = Array.from(challengeSetting)
    for (const i in datas) {
        if (Object.hasOwnProperty.call(datas, i)) {
            const data = datas[i];
            appData[data[0]] = data[1]
        }
    }
    settingModal.classList.remove("active");
    document.getElementsByClassName("challenge-title")[0].innerHTML = appData.challengeName
    setTable()
    saveAppData()

}

function addModalEvt(item, idx) {
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
}

function setTable() {
    app.innerHTML=""
    for (const key in appData.data) {
        if (Object.hasOwnProperty.call(appData.data, key)) {
            const stamp = appData.data[key];
            const el = createDom(dom="div", id=`item${key}`,className="table-item", child= stamp==4 ? key : stickers[stamp].cloneNode())
            el.setAttribute('data-value', stamp)
            app.append(el)
        }
        if (key==appData.challengeTerm){
            break
        }
    }
    const tableItem = document.querySelectorAll(".table-item");
    tableItem.forEach((item, idx) => {
        addModalEvt(item,idx)
    });


}



function init() {
    // 최초 데이터 없을때 초기화
    if (!localStorage.getItem("habitChallengeData")){
        defaultData = {};
        [...Array(30)].forEach((k,i)=>{
            defaultData[i+1] = 4
        })

        localStorage.setItem("habitChallengeData", JSON.stringify({
            challengeName:"제목을 설정해주세요",
            data:defaultData,
            challengeTerm:30,
        }))
    }
    appData = JSON.parse(localStorage.getItem("habitChallengeData"))
    document.getElementById("challenge-name").value = appData.challengeName
    document.getElementById(`day_${appData.challengeTerm}`).checked = true

    document.getElementsByClassName("challenge-title")[0].innerHTML = appData.challengeName

    // const app = document.getElementsByClassName("table-item-wrap")[0]

    setTable()
    progressCheck()
}


init()



// 스티커 추가 이벤트
const challengeTable = document.querySelector(".challenge-table");
const selectSticker = document.querySelector(".select-sticker");





stickers.forEach((item,idx)=>{
    const idx1 = idx
    item.addEventListener("click", ()=>setSticker(idx1))
})



// 스티커 선택창 스타일 변경ww
// tableItem를 클릭할 때마다 스티커 선택창 위치가 변경됨.
function stickerStyle(i, e){
    // margin 값을 포함한 tableItem의 width값
    const tableItemWidth = e.offsetWidth + parseInt(window.getComputedStyle(e).getPropertyValue("margin-bottom"), 10);
    const index = i%5;
    selectSticker.style.top = i<16 ? `${tableItemWidth+e.offsetTop}px` : `${e.offsetTop-selectSticker.offsetHeight}px`;
    selectSticker.style.left = index <= 1?`${e.offsetLeft}px`: `${e.offsetLeft-e.offsetWidth*index-e.style.marginTop}px`;
    selectedItem = i
}

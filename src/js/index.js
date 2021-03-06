//로컬스토리지 이름
const storageName = "habitChallengeDB"

// 챌린지 설정(수정)하기 모달창 띄우기
const settingBtn = document.querySelector(".setting-btn");
const shareBtn = document.querySelector(".share-btn")
const settingModal = document.querySelector(".setting");
const shareModal = document.querySelector(".share");

const cancelBtns = document.querySelectorAll(".cancel-btn");
const stickers = document.querySelectorAll(".sticker");
const setBtn = document.querySelector(".set-btn");
const progressBar = document.querySelector(".progress-bar");
const app = document.getElementsByClassName("table-item-wrap")[0];

let selectedItem;
let appData = {};

const saveBtn = document.querySelector('#img-capture-btn');

window.addEventListener("keydown",function(e) {
    if(e.keyCode===13){
        e.preventDefault();
    }
})

setBtn.addEventListener("click", setChallenge);

settingBtn.addEventListener("click", function() {
    settingModal.classList.add("active");
});

shareBtn.addEventListener("click", function() {
    shareModal.classList.add("active");
});

[...cancelBtns].forEach(btn => {
    btn.addEventListener("click", function() {
        settingModal.classList.remove("active");
        shareModal.classList.remove("active");
    });
});

function createDom(dom="div", id="", className="", child="") {
    const el = document.createElement(dom);

    el.className = className;
    el.id = id;
    el.append(child);

    return el;
}

function progressCheck() {
    const items = document.getElementsByClassName("table-item");
    let count = 0;
    [...items].forEach(item => {
        count += item.dataset.value < 4 ? 1 : 0;
    });
    progressBar.style.width = `${count/items.length*100}%`;
}

function saveAppData() {
    localStorage.setItem(storageName, JSON.stringify(appData));
    progressCheck();
}

//일정에 도장찍기
function setSticker(idx) {
    const selectedDom = document.getElementById(`item${selectedItem+1}`);
    selectedDom.dataset.value = idx;
    
    selectedDom.innerHTML = `
        <div class="img-wrapper">
            <img src="${stickers[idx].src}" alt="sticker" class="sticker">
        </div>`;
    
    const sticker = selectedDom.querySelector(".sticker");
    sticker.addEventListener('click', addModalEvt);
    appData['data'][selectedItem+1] = idx;
    saveAppData();
}

//챌린지 설정
function setChallenge() {
    const challengeSetting = new FormData(document.getElementById("setChallengeForm"));
    const datas = Array.from(challengeSetting);
    
    for (const i in datas) {
        if (Object.hasOwnProperty.call(datas, i)) {
            const data = datas[i];
            appData[data[0]] = data[1];
        }
    }

    settingModal.classList.remove("active");
    document.getElementsByClassName("challenge-title")[0].innerHTML = appData.challengeName;
    document.getElementById("start-date").innerHTML = appData.startDate;

    setTable();
    saveAppData();
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
    }, {capture: true});
}

function setTable() {
    app.innerHTML = "";
    for (const key in appData.data) {
        if (Object.hasOwnProperty.call(appData.data, key)) {
            const stamp = appData.data[key];
            const el = createDom(dom="div", id=`item${key}`,className="table-item", child= stamp==4 ? key : stickers[stamp].cloneNode());
            el.setAttribute('data-value', stamp);
            app.append(el);
        }

        if (key == appData.challengeTerm){
            break;
        }
    }

    const tableItem = document.querySelectorAll(".table-item");

    tableItem.forEach((item, idx) => {
        addModalEvt(item,idx);
    });
}


function init() {
    // 최초 데이터 없을때 초기화
    if (!localStorage.getItem(storageName)){
        const defaultData = {};
        [...Array(60)].forEach((k, i) => {
            defaultData[i + 1] = 4;
        });

        const date = new Date;

        localStorage.setItem(storageName, JSON.stringify({
            challengeName:"제목을 설정해 주세요",
            data:defaultData,
            challengeTerm:25,
            startDate:date.toDateString()
        }));
    }

    appData = JSON.parse(localStorage.getItem(storageName));
    document.getElementById("challenge-name").value = appData.challengeName;
    document.getElementById(`day_${appData.challengeTerm}`).checked = true;
    document.getElementById('');
    document.getElementsByClassName("challenge-title")[0].innerHTML = appData.challengeName;
    document.getElementById("start-date").innerHTML = appData.startDate;

    setTable();
    progressCheck();
}

init();

// 초기화 버튼
const resetBtn = document.querySelector(".reset-btn");
const confirmMsg = document.querySelector(".confirm-msg");

resetBtn.addEventListener("click", function(){
    confirmMsg.style.display = "block";
    resetBtn.innerText = "네!";

    if (resetBtn.classList.contains("check")){
        const defaultData = {};
        [...Array(60)].forEach((k, i) => {
            defaultData[i+1] = 4;
        });

        const date = new Date;

        localStorage.setItem(storageName, JSON.stringify({
            challengeName:"제목을 설정해 주세요",
            data:defaultData,
            challengeTerm:25,
            startDate:date.toDateString()
        }));

        appData = JSON.parse(localStorage.getItem(storageName));
        document.getElementById("challenge-name").value = appData.challengeName;
        document.getElementById(`day_${appData.challengeTerm}`).checked = true;
        document.getElementById('');
        document.getElementsByClassName("challenge-title")[0].innerHTML = appData.challengeName;
        document.getElementById("start-date").innerHTML = appData.startDate;
        
        confirmMsg.style.display = "none";

        setTable();
        progressCheck();

        settingModal.classList.remove("active");
        resetBtn.innerText = "챌린지 초기화";
        resetBtn.classList.remove("check");
    } else {
        resetBtn.classList.add("check");
    }
});

// 스티커 추가 이벤트
const tableItem = document.querySelectorAll(".table-item");
const challengeTable = document.querySelector(".challenge-table");
const selectSticker = document.querySelector(".select-sticker");


stickers.forEach((item,idx)=>{
    const idx1 = idx;
    item.addEventListener("click", ()=>{
        setSticker(idx1);
    });
})

// 스티커 선택창 스타일 변경
// tableItem를 클릭할 때마다 스티커 선택창 위치가 변경됨.
function stickerStyle(i, e){
    // margin 값을 포함한 tableItem의 width값
    const tableItemWidth = e.offsetWidth + parseInt(window.getComputedStyle(e).getPropertyValue("margin-bottom"), 10);
    const index = i % 5;

    selectSticker.style.top = `${tableItemWidth+e.offsetTop}px`;
    selectSticker.style.left = index >= 1 ? `${tableItem[1].offsetLeft}px` : `${e.offsetLeft}px`;

    selectedItem = i;
}

//스크린샷 기능
async function screenShot() {
    shareModal.classList.remove("active");
    const padding = 5;
    const cv = await html2canvas(document.body);
    const ratio =  cv.width/ document.body.getBoundingClientRect().width
    const left = document.querySelector(".challenge-table").offsetLeft * ratio
    const top = document.querySelector(".contents-header").offsetTop * ratio
    const height = document.querySelector(".challenge-table").offsetHeight*ratio + document.querySelector(".contents-header").offsetHeight * ratio + top;
    const width = document.querySelector(".challenge-table").offsetWidth*ratio
    const canvas = document.createElement("canvas");
    const imgData = cv.getContext("2d").getImageData(left-left/padding,top-top/padding,width+left*2/padding,height+top*2/padding);
    canvas.width = imgData.width;
    canvas.height = imgData.height;
    canvas.getContext("2d").putImageData(imgData, 0, 0);

    const img = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
    const vDom = document.createElement('a');
    vDom.href = img;
    vDom.download = "myChallenge.jpg";
    vDom.click();
}

function shareFacebook() {
    let url = window.location.href;
    let facebook = 'http://www.facebook.com/sharer/sharer.php?u=';
    let link = facebook + url;
    window.open(link);
    shareModal.classList.remove("active");
}

function shareTwitter() {
    let url = window.location.href;
    let sendText = "하루한번 챌린지!"; // 전달할 텍스트
    let twitter = "https://twitter.com/intent/tweet?text="
    window.open(twitter + sendText + "&url=" + url);
    shareModal.classList.remove("active");
}

function shareKakao() {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: "Day Habit Challenge",
            description: "하루하루 천천히 습관만들기 도전!", 
            imageUrl: "https://weniv.github.io/30daysChallengeHabit/src/img/thumbnail.png",
            link: {
                    mobileWebUrl: "http://habitmaker.co.kr",
                    webUrl: "http://habitmaker.co.kr"
            }
        }
    })

    shareModal.classList.remove("active");
}

saveBtn.addEventListener('click',screenShot);

Kakao.init('551505ed5b3d098a365d690f62520040');


// 모달창 닫기
window.onclick = function(e) {
    if(settingModal) {
        if(e.target == settingModal) {
            settingModal.classList.remove("active");
        }
    }

    if(shareModal) {
        if(e.target == shareModal) {
            shareModal.classList.remove("active");
        }
    }

    if(e.target != resetBtn) {
        confirmMsg.style.display = "none";
        resetBtn.innerText = "챌린지 초기화";
        resetBtn.classList.remove("check");
    }
};

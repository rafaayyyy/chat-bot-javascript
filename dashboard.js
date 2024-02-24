const signedInProfilePic = document.querySelector(".profile-pic-div");
const signedInUserName = document.querySelector(".profile-pic-name");
const usersListShow = document.querySelector(".users-list");
const chatDiv = document.querySelector(".message-section");
const chatterNameDiv = document.querySelector(".chatter-name-div");
const messageSendingDiv = document.querySelector(".message-sending-div");
const messagesContentDiv = document.querySelector(".messages-content-div");
var currID;
let currentChatter = 0;

if (currentChatter == 0) {
  messageSendingDiv.classList.add("d-none");
}
if (localStorage.getItem("signedInUser")) {
} else {
  alert("User Session not found. Sign In Again!");
  window.location = "./signin.html";
}

usersListShow.addEventListener("click", chatClicked);

let users = JSON.parse(localStorage.getItem("usersLocalStorage")) || [];
const signedInUserID = JSON.parse(localStorage.getItem("signedInUser"));

// const dummyUserInfo = {
//   userId: "",
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
//   confirmedPassword: "",
//   messageHistory: [],
// };

for (let x of users) {
  if (signedInUserID == x.userId) {
    signedInProfilePic.textContent = x.firstName[0] + x.lastName[0];
    signedInUserName.textContent = x.firstName + " " + x.lastName;
    x.lastActivityTime = new Date();
    break;
  }
}

function isDate(myDate) {
  return myDate.constructor === Date;
}

for (let x of users) {
  if (signedInUserID != x.userId) {
    var newLiElement = document.createElement("li");
    // console.log("type:", new Date(x.lastActivityTime));
    x.lastActivityTime = new Date(x.lastActivityTime);
    newLiElement.innerHTML = `
    <div class="p-0 m-0 d-flex justify-content-between align-items-center">
      <div class="d-flex justify-content-start align-items-center py-2" style="max-width:85%">
          <div class="bg-primary users-pic-div">${
            x.firstName[0] + x.lastName[0]
          }</div>
          <p class="p-0 m-0 fw-semibold align-self-center ms-2 fs-4 profile-pic-name" style="width: 75%; white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;">${x.firstName + " " + x.lastName}</p>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <p class="p-0 m-0 fw-light fs-6 text-muted align-self-center me-3">${
          x.lastActivityTime.getHours().toString().padStart(2, "0") +
          ":" +
          x.lastActivityTime.getMinutes().toString().padStart(2, "0")
        }</p>
      </div>
    </div>
    `;
    newLiElement.dataset.chatterInfo = x.userId;
    newLiElement.classList.add(
      "border",
      "border-3",
      "pt-1",
      "ps-1",
      "user-li-item"
    );
    // console.log(newLiElement.dataset.chatterInfo);
    usersListShow.appendChild(newLiElement);
  }
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function chatClicked(event) {
  const clickedElement = event.target.closest(".user-li-item");
  messageSendingDiv.classList.remove("d-none");
  if (clickedElement) {
    chatterNameDiv.innerHTML = "";
    currentChatter = clickedElement.dataset.chatterInfo;
    for (let x of users) {
      // console.log(x.userId);
      if (currentChatter == x.userId) {
        let nameDiv = document.createElement("div");
        nameDiv.innerHTML = `
          <div class="d-flex justify-content-start align-items-center py-1">
              <div class="bg-primary users-pic-div">${
                x.firstName[0] + x.lastName[0]
              }</div>
              <p class="p-0 m-0 fw-bold align-self-center ms-2 fs-4 profile-pic-name">${
                x.firstName + " " + x.lastName
              }</p>
          </div>
          <div>
            <i data-toggle="tooltip" data-placement="bottom" title="Clear All Chats" class="bi bi-trash-fill align-self-center mx-2" role="button" onclick="deleteAllMessages()"
              style="font-size: 26px;"></i>
          </div>
          `;
        nameDiv.classList.add(
          "px-1",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );

        const listItems = usersListShow.querySelectorAll("li");
        listItems.forEach((li) => {
          if (currentChatter == li.dataset.chatterInfo) {
            li.classList.add("opened-chat");
          } else {
            li.classList.remove("opened-chat");
          }
        });
        chatterNameDiv.appendChild(nameDiv);
      }
    }
    displayMessages();
  }
}

function resize() {
  let messageBox = document.querySelector("#message-textbox");
  messageBox.style.height = "auto";
  const naturalHeight = messageBox.scrollHeight;
  const maxHeight = 150;

  if (messageBox.value.trim() == "") {
    messageBox.style.height = "1.2em";
  } else {
    messageBox.style.height =
      naturalHeight > maxHeight ? maxHeight + "px" : naturalHeight + "px";
    messageBox.style.overflowY = naturalHeight > maxHeight ? "auto" : "hidden";
  }
}

function sendMessageButton() {
  const messageBox = document.querySelector("#message-textbox");
  const txt = messageBox.value.trim();
  if (txt == "") {
    return;
  }
  let nameofChatter = "";
  const timeVal = new Date();
  for (let x of users) {
    if (currentChatter == x.userId) {
      nameofChatter = x.firstName;
    }
  }
  for (let x of users) {
    if (signedInUserID == x.userId) {
      const messageInfo = {
        chatterName: nameofChatter,
        chattingID: currentChatter,
        messageContent: {
          senderID: signedInUserID,
          messageTime: timeVal,
          messageText: txt,
        },
      };
      x.messageHistory.push(messageInfo);
    }
  }
  for (let x of users) {
    if (signedInUserID == x.userId) {
      nameofChatter = x.firstName;
    }
  }
  for (let x of users) {
    if (currentChatter == x.userId) {
      const messageInfo = {
        chatterName: nameofChatter,
        chattingID: signedInUserID,
        messageContent: {
          senderID: signedInUserID,
          messageTime: timeVal,
          messageText: txt,
        },
      };
      x.messageHistory.push(messageInfo);
    }
  }
  messageBox.value = "";
  // messageBox = document.querySelector("#message-textbox");
  // messageBox.style.height = "35px";
  resize();
  localStorage.setItem("usersLocalStorage", JSON.stringify(users));
  displayMessages();
  users = JSON.parse(localStorage.getItem("usersLocalStorage")) || [];
}

function displayMessages() {
  messagesContentDiv.innerText = "";
  let _dum = 0;
  for (let x of users) {
    if (signedInUserID == x.userId) {
      for (let messages of x.messageHistory) {
        if (
          currentChatter == messages.chattingID ||
          signedInUserID == messages.chattingID
        ) {
          let msgDiv = document.createElement("div");
          msgDiv.classList.add(
            "px-1",
            "d-flex",
            "align-items-center",
            "w-100",
            "container-div"
          );
          if (_dum == 0) {
            msgDiv.classList.add("pt-2");
            _dum = 1;
          }
          if (messages.messageContent.senderID == signedInUserID) {
            msgDiv.classList.add("justify-content-end");
          } else {
            msgDiv.classList.add("justify-content-start");
          }
          messages.messageContent.messageTime = new Date(
            messages.messageContent.messageTime
          );
          msgDiv.dataset.timesent =
            messages.messageContent.messageTime.toISOString();
          msgDiv.innerHTML = `
            <div class="py-1 msg-container-div rounded rounded-2 ps-2 pe-3" style="max-width:60%;">
                <p style="white-space:pre-wrap" class="text-start d-inline p-0 m-0 fw-semibold align-self-center text-white text-break"
                >${messages.messageContent.messageText}</p>
                <p style="font-size: 10px; float:right" class="timeP-Tag d-inline-block mt-auto mb-0 p-0 m-0 ps-1 pt-3 fw-lighter text-muted align-self-end">${
                  messages.messageContent.messageTime
                    .getHours()
                    .toString()
                    .padStart(2, "0") +
                  ":" +
                  messages.messageContent.messageTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")
                }</p>
                <div class="hidden-delete-buttons align-self-center mx-2">
                  <i style="font-size:12px" data-toggle="tooltip" data-placement="bottom" title="Delete For Me" class="bi bi-trash" role="button" onclick="deleteMyMessage(this)"></i>
                  <i style="font-size:12px" data-toggle="tooltip" data-placement="top" title="Delete For Everyone" class="bi bi-trash-fill del-for-everyone" role="button" onclick="deleteForEveryone(this)"></i>
                </div>
            </div>
          `;
          const pTag = msgDiv.querySelector(".timeP-Tag");
          const divTag = msgDiv.querySelector("div");
          const delForEveryButton = msgDiv.querySelector(".del-for-everyone");
          if (messages.messageContent.senderID == signedInUserID) {
            pTag.classList.add("ps-0");
            divTag.classList.add("bg-warning");
            delForEveryButton.classList.add("d-inline");
          } else {
            pTag.classList.add("ps-2");
            divTag.classList.add("bg-danger");
            delForEveryButton.classList.add("d-none");
          }
          messagesContentDiv.prepend(msgDiv);
        }
      }
    }
  }
}

function deleteMyMessage(iconElement) {
  const parentDiv = iconElement.closest(".container-div");
  const childDiv = parentDiv.querySelector(".msg-container-div");
  if (childDiv) {
    childDiv.style.display = "none";
  }
  if (parentDiv) {
    parentDiv.style.display = "none";
  }
  let msgTimeSent = parentDiv.dataset.timesent;
  for (let x of users) {
    if (signedInUserID == x.userId) {
      x.messageHistory = x.messageHistory.filter(
        (messageContentElement) =>
          new Date(
            messageContentElement.messageContent.messageTime
          ).toISOString() != new Date(msgTimeSent).toISOString()
      );
    }
  }
  localStorage.setItem("usersLocalStorage", JSON.stringify(users));
  users = JSON.parse(localStorage.getItem("usersLocalStorage"));
}

function deleteForEveryone(iconElement) {
  const parentDiv = iconElement.closest(".container-div");
  const childDiv = parentDiv.querySelector(".msg-container-div");

  let msgTimeSent = parentDiv.dataset.timesent;
  for (let x of users) {
    if (signedInUserID == x.userId) {
      x.messageHistory = x.messageHistory.filter(
        (messageContentElement) =>
          new Date(
            messageContentElement.messageContent.messageTime
          ).toISOString() != new Date(msgTimeSent).toISOString()
      );
    }
  }
  for (let x of users) {
    if (currentChatter == x.userId) {
      x.messageHistory = x.messageHistory.filter(
        (messageContentElement) =>
          new Date(
            messageContentElement.messageContent.messageTime
          ).toISOString() != new Date(msgTimeSent).toISOString()
      );
    }
  }

  if (childDiv) {
    childDiv.style.display = "none";
  }
  if (parentDiv) {
    parentDiv.style.display = "none";
  }
  localStorage.setItem("usersLocalStorage", JSON.stringify(users));
  users = JSON.parse(localStorage.getItem("usersLocalStorage"));
}

function customSignOutSubmitFunc() {
  alert("You have signed out");
  localStorage.removeItem("signedInUser");
  window.location = "./signin.html";
}

function deleteAllMessages() {
  for (let x of users) {
    if (signedInUserID == x.userId) {
      // console.log("User Id: ", x.userId);
      // console.log("User Name: ", x.firstName);
      // console.log("Before : ", x.messageHistory);
      x.messageHistory = x.messageHistory.filter(
        (messageContentElement) =>
          messageContentElement.chattingID != currentChatter
      );
      // console.log("After : ", x.messageHistory);
    }
  }
  messagesContentDiv.innerHTML = "";
  localStorage.setItem("usersLocalStorage", JSON.stringify(users));
  users = JSON.parse(localStorage.getItem("usersLocalStorage"));
}

function searchFunc() {
  var searchInput = document.getElementById("search").value;
  // console.log(searchInput);

  if (searchInput != "") {
    let searchStrings = searchInput
      .split(" ")
      .filter((str) => str.trim() !== "");
    let toSearch = "";
    for (let str of searchStrings) {
      toSearch += str.toLowerCase();
    }
    usersListShow.innerHTML = "";
    for (let x of users) {
      if (signedInUserID != x.userId) {
        var newLiElement = document.createElement("li");
        newLiElement.innerHTML = `
        <div class="p-0 m-0 d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center py-2" style="max-width:85%">
              <div class="bg-primary users-pic-div">${
                x.firstName[0] + x.lastName[0]
              }</div>
              <p class="p-0 m-0 fw-semibold align-self-center ms-2 fs-4 profile-pic-name" style="width: 75%; white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;">${x.firstName + " " + x.lastName}</p>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <p class="p-0 m-0 fw-light fs-6 text-muted align-self-center me-3">${
              x.lastActivityTime.getHours().toString().padStart(2, "0") +
              ":" +
              x.lastActivityTime.getMinutes().toString().padStart(2, "0")
            }</p>
          </div>
        </div>
          `;
        newLiElement.dataset.chatterInfo = x.userId;
        newLiElement.classList.add(
          "border",
          "border-3",
          "pt-1",
          "ps-1",
          "user-li-item"
        );
        // console.log(toSearch);
        if (
          toSearch == x.firstName.substring(0, toSearch.length).toLowerCase() ||
          toSearch == x.lastName.substring(0, toSearch.length).toLowerCase() ||
          toSearch ==
            x.firstName.toLowerCase() +
              x.lastName
                .substring(0, searchInput.length - x.firstName.length - 1)
                .toLowerCase()
        ) {
          // console.log(newLiElement.dataset.chatterInfo);
          usersListShow.appendChild(newLiElement);
        }
      }
    }
  } else {
    usersListShow.innerHTML = "";
    for (let x of users) {
      if (signedInUserID != x.userId) {
        var newLiElement = document.createElement("li");
        newLiElement.innerHTML = `
        <div class="p-0 m-0 d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center py-2" style="max-width:85%">
              <div class="bg-primary users-pic-div">${
                x.firstName[0] + x.lastName[0]
              }</div>
              <p class="p-0 m-0 fw-semibold align-self-center ms-2 fs-4 profile-pic-name" style="width: 75%; white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;">${x.firstName + " " + x.lastName}</p>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <p class="p-0 m-0 fw-light fs-6 text-muted align-self-center me-3">${
              x.lastActivityTime.getHours().toString().padStart(2, "0") +
              ":" +
              x.lastActivityTime.getMinutes().toString().padStart(2, "0")
            }</p>
          </div>
        </div>
        `;
        newLiElement.dataset.chatterInfo = x.userId;
        newLiElement.classList.add(
          "border",
          "border-3",
          "pt-1",
          "ps-1",
          "user-li-item"
        );
        // console.log(newLiElement.dataset.chatterInfo);
        usersListShow.appendChild(newLiElement);
      }
    }
  }
}

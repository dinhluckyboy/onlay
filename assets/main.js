// 1 basic modal
const basicBtn = document.querySelector(".modal__btn--basic");
const modalBasic = new Onlay({
  templateId: "modal__onlay-basic",
  enableScrollLock: false,
});
basicBtn.onclick = () => {
  modalBasic.open();
};

// 2 Modal With Buttons
const withButtonsBtn = document.querySelector(".modal__btn--button");
const modalWithButtons = new Onlay({
  templateId: "modal__onlay-button",
  footer: true,
  closeMethods: [],
});
modalWithButtons.addFooterButton(
  "Cancel",
  "template__btn template__btn--close",
  () => {
    console.log("Click close button");
    modalWithButtons.close();
  }
);
modalWithButtons.addFooterButton(
  "Agree",
  "template__btn template__btn--agree",
  () => {
    console.log("Click agree button");
    modalWithButtons.close();
  }
);
withButtonsBtn.onclick = () => {
  modalWithButtons.open();
};

// 3 Large Content Modal
const largeContentBtn = document.querySelector(".modal__btn--large");
const modalLargeContent = new Onlay({
  templateId: "modal__onlay-large",
});
largeContentBtn.onclick = () => {
  modalLargeContent.open();
};

// 4 Multiple Modals
const multipleBtn = document.querySelector(".modal__btn--multiple");
const modalMultiple = new Onlay({
  templateId: "modal__onlay-multiple",
});
multipleBtn.onclick = () => {
  modalMultiple.open();
};

// 5 Youtube Embed Modal
const embedBtn = document.querySelector(".modal__btn--embed");
const modalEmbed = new Onlay({
  templateId: "modal__onlay-embed",
});
embedBtn.onclick = () => {
  modalEmbed.open();
};

// 6 Persistent Modal
const persistentBtn = document.querySelector(".modal__btn--persistent");
const modalPersistent = new Onlay({
  templateId: "modal__onlay-persistent",
  destroyOnClose: false,
});
persistentBtn.onclick = () => {
  modalPersistent.open();
};

// 7 Input Content
const contentOutsideBtn = document.querySelector(".modal__btn--outside");
const modalContentOutside = new Onlay({
  content: "<h2>Content Input From JS</h2>",
  templateId: "template-2",
});
contentOutsideBtn.onclick = () => {
  modalContentOutside.open();
};

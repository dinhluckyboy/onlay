// basic modal
const basicBtn = document.querySelector(".modal__btn--basic");
const modalBasic = new Onlay({
  templateId: "modal__onlay-basic",
});
basicBtn.onclick = () => {
  modalBasic.open();
};

// Modal With Buttons
const withButtonsBtn = document.querySelector(".modal__btn--button");
const modalWithButtons = new Onlay({
  templateId: "modal__onlay-button",
  footer: true,
  closeMethods: ["button", "escape"],
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

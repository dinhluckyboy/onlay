Onlay.elements = []; // array save model open current

function Onlay(option = {}) {
  // get content... from option
  this.opt = Object.assign(
    {
      //  templateId,
      closeMethods: ["button", "overlay", "escape"],
      destroyOnClose: true,
      cssClass: [],
      // onOpen,
      // onClose,
      footer: false,
    },
    option
  );

  this.template = document.querySelector(`#${this.opt.templateId}`);
  if (!this.template) {
    console.error("template id none exits");
    return;
  }
  this._allowButtonClose = this.opt.closeMethods.includes("button");
  this._allowBackdropClose = this.opt.closeMethods.includes("overlay");
  this._allowEscapeClose = this.opt.closeMethods.includes("escape");

  this._footerButton = [];
}

// -----------------

Onlay.prototype._createElement = function () {
  const content = this.template.content.cloneNode(true);
  // create element
  this._backdrop = document.createElement("div");
  this._backdrop.className = "onlay__backdrop";

  const container = document.createElement("div");
  container.className = "onlay__container";

  if (this.opt.cssClass.length > 0) {
    this.opt.cssClass.forEach((className) => {
      if (typeof className === "string") {
        container.classList.add(className);
      }
    });
  } // add css class to container

  if (this._allowButtonClose) {
    const btnClose = this._createButton("&times;", "onlay__close", () =>
      this.close()
    );
    container.append(btnClose); // append element
  }

  const modelContent = document.createElement("div");
  modelContent.className = "onlay__content";

  // append element
  modelContent.append(content);
  container.append(modelContent);
  this._backdrop.append(container);
  document.body.append(this._backdrop);

  // add footer
  if (this.opt.footer) {
    this._modelFooter = document.createElement("div");
    this._modelFooter.className = "onlay__footer";
    this._renderFooterContent(); // render footer content
    this._renderButton(); // render button to footer
    container.append(this._modelFooter); // add footer to container
  }
};

Onlay.prototype.open = function () {
  Onlay.elements.push(this); // push model open current

  if (!this._backdrop) {
    this._createElement();
  }

  // show backdrop
  setTimeout(() => {
    this._backdrop.classList.add("onlay__backdrop--show");
  }, 0);

  // handel close event
  if (this._allowBackdropClose) {
    this._backdrop.onclick = (e) => {
      if (e.target === this._backdrop) {
        this.close();
      }
    };
  }

  // handel escape close
  this._handelEscapeClose = (e) => {
    const lastModel = Onlay.elements[Onlay.elements.length - 1]; // last model
    if (e.key === "Escape" && this === lastModel) {
      this.close();
    }
  };

  if (this._allowEscapeClose) {
    document.addEventListener("keydown", this._handelEscapeClose);
  }

  // disable scroll
  document.body.classList.add("onlay--no-scroll");
  //padding right scroll bar
  document.body.style.paddingRight = this._getScrollBar() + "px";

  // onOpen
  this._onTransitionEnd(this.opt.onOpen);

  return this._backdrop;
};

Onlay.prototype.close = function (destroy = this.opt.destroyOnClose) {
  if (this._allowEscapeClose) {
    document.removeEventListener("keydown", this._handelEscapeClose);
  } // remove event listener

  Onlay.elements.pop(); // remove element last array

  this._backdrop.classList.remove("onlay__backdrop--show");

  this._onTransitionEnd(() => {
    this._backdrop.ontransitionend = null; // gỡ handel sau khi chạy xong

    if (destroy && this._backdrop) {
      this._backdrop.remove();
      this._backdrop = null;
      this._modelFooter = null;
    }

    // onClose
    if (typeof this.opt.onClose === "function") {
      this.opt.onClose();
    }
    if (!Onlay.elements.length) {
      // enable scroll
      document.body.classList.remove("onlay--no-scroll");
      //remove padding right scroll bar
      document.body.style.paddingRight = "";
    } // Onlay.length = 0 thi show scroll bar
  });
};

Onlay.prototype.destroy = function () {
  this.close(true);
};

Onlay.prototype._onTransitionEnd = function (callback) {
  this._backdrop.ontransitionend = (e) => {
    if (e.propertyName !== "transform") return;
    if (typeof callback === "function") {
      callback();
    }
  };
};

Onlay.prototype._getScrollBar = function () {
  if (this._scrollBarWidth !== undefined) return this._scrollBarWidth;
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "-999px";
  div.style.width = "100px";
  div.style.height = "100px";
  div.style.overflow = "scroll";
  document.body.appendChild(div);
  this._scrollBarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  return this._scrollBarWidth;
};

Onlay.prototype.setFooterContent = function (html) {
  this._footerContent = html;
  this._renderFooterContent(); // render footer content
};

Onlay.prototype.addFooterButton = function (title, className, callback) {
  const btn = this._createButton(title, className, callback);
  this._footerButton.push(btn);
  this._renderButton(); // render button to footer
};

Onlay.prototype._createButton = function (title, className, callback) {
  const btn = document.createElement("button");
  btn.className = className;
  btn.innerHTML = title;
  btn.onclick = callback;
  return btn;
};

Onlay.prototype._renderButton = function () {
  if (this._footerButton.length > 0 && this._modelFooter) {
    this._footerButton.forEach((btn) => {
      this._modelFooter.append(btn);
    });
  }
}; // render button to footer

Onlay.prototype._renderFooterContent = function () {
  if (this._modelFooter && this._footerContent) {
    this._modelFooter.innerHTML = this._footerContent;
  }
}; // render footer content

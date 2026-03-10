Onlay.elements = []; // array save modal open current

function Onlay(option = {}) {
  if (!option.templateId && !option.content) {
    console.error("Please provide the templateId or content.");
    return;
  }

  if (option.templateId && option.content) {
    console.warn(
      "Both 'templateId' and 'content' provided. 'content' will be used."
    );
  }
  // get content... from option
  this.opt = Object.assign(
    {
      //  templateId,
      closeMethods: ["button", "overlay", "escape"],
      destroyOnClose: true,
      enableScrollLock: true,
      scrollLockTarget: () => {
        return document.body;
      },
      cssClass: [],
      // onOpen,
      // onClose,
      footer: false,
      // content,
    },
    option
  );

  if (!this.opt.content) {
    this.template = document.querySelector(`#${this.opt.templateId}`);
    if (!this.template) {
      console.error("Template id none exits");
      return;
    }
  }
  this._allowButtonClose = this.opt.closeMethods.includes("button");
  this._allowBackdropClose = this.opt.closeMethods.includes("overlay");
  this._allowEscapeClose = this.opt.closeMethods.includes("escape");

  this._footerButton = [];
  this._content;
  this._scrollTarget = this.opt.scrollLockTarget();
}

// -----------------

Onlay.prototype._createElement = function () {
  if (!this.opt.content) {
    this._content = this.template.content.cloneNode(true);
  } else {
    this._content = document.createElement("div");
    this._content.innerHTML = this.opt.content;
  }

  // create element
  this._backdrop = document.createElement("div");
  this._backdrop.className = "onlay__backdrop";

  this._container = document.createElement("div");
  this._container.className = "onlay__container";

  if (this.opt.cssClass.length > 0) {
    this.opt.cssClass.forEach((className) => {
      if (typeof className === "string") {
        this._container.classList.add(className);
      }
    });
  } // add css class to container

  if (this._allowButtonClose) {
    const btnClose = this._createButton("&times;", "onlay__close", () =>
      this.close()
    );
    this._container.append(btnClose); // append element
  }

  this._modalContent = document.createElement("div");
  this._modalContent.className = "onlay__content";

  // append element
  this._modalContent.append(this._content);
  this._container.append(this._modalContent);
  this._backdrop.append(this._container);
  document.body.append(this._backdrop);

  // add footer
  if (this.opt.footer) {
    this._modalFooter = document.createElement("div");
    this._modalFooter.className = "onlay__footer";
    this._renderFooterContent(); // render footer content
    this._renderButton(); // render button to footer
    this._container.append(this._modalFooter); // add footer to container
  }
};

Onlay.prototype.open = function () {
  Onlay.elements.push(this); // push modal open current

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
    const lastmodal = Onlay.elements[Onlay.elements.length - 1]; // last modal
    if (e.key === "Escape" && this === lastmodal) {
      this.close();
    }
  };

  if (this._allowEscapeClose) {
    document.addEventListener("keydown", this._handelEscapeClose);
  }

  if (this.opt.enableScrollLock && this.hasScrollBar()) {
    // disable scroll
    this._scrollTarget.classList.add("onlay--no-scroll");
    //padding right scroll bar
    const paddingRight = parseInt(
      getComputedStyle(this._scrollTarget).paddingRight
    );
    this._scrollTarget.style.paddingRight =
      paddingRight + this._getScrollBar() + "px";
  }

  // onOpen
  this._onTransitionEnd(this.opt.onOpen);

  return this._backdrop;
};

Onlay.prototype.setContent = function (content) {
  if (typeof content !== "string") {
    console.error("Content must be a string");
    return;
  }
  this._content = content;
  console.log(this._content);
  if (this._backdrop) {
    this._modalContent.innerHTML = this._content;
  } else {
    this._createElement();
    this._content = content;
    this._modalContent.innerHTML = this._content;
  }
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
      this._modalFooter = null;
    }

    // onClose
    if (typeof this.opt.onClose === "function") {
      this.opt.onClose();
    }
    if (
      !Onlay.elements.length &&
      this.opt.enableScrollLock &&
      this.hasScrollBar()
    ) {
      // enable scroll
      this._scrollTarget.classList.remove("onlay--no-scroll");
      //remove padding right scroll bar
      this._scrollTarget.style.paddingRight = "";
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

Onlay.prototype.hasScrollBar = function () {
  return this._scrollTarget.scrollHeight > this._scrollTarget.clientHeight;
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
  if (this._footerButton.length > 0 && this._modalFooter) {
    this._footerButton.forEach((btn) => {
      this._modalFooter.append(btn);
    });
  }
}; // render button to footer

Onlay.prototype._renderFooterContent = function () {
  if (this._modalFooter && this._footerContent) {
    this._modalFooter.innerHTML = this._footerContent;
  }
}; // render footer content

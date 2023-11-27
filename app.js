function app() {
  //define all variables
  const MARKED_AS_DONE = "checkbox-done";
  const notificationBar = document.getElementById("notification-alert");
  const notificationBarToggle = document.getElementById("nav-notification");
  const menu = document.getElementById("menu");
  const menuToggle = document.getElementById("user-info");
  const closeBtn = document.getElementById("close-button");
  const guideDownArrow = document.getElementById("down-arrow");
  const guideUpArrow = document.getElementById("up-arrow");
  const showGuideState =
    document.getElementById("setup-guide-open").style.display;

  const setupGuideItems = document.getElementsByClassName("setup-guide-item");
  const setupGuideItemsArray = Array.from(setupGuideItems);
  const checkboxes = document.getElementsByClassName("loading-circle");
  const checkboxesArray = Array.from(checkboxes);

  const loadingSpinners = document.getElementsByClassName("loading-spinner");
  const loadingSpinnersArray = Array.from(loadingSpinners);

  const completedIcons = document.getElementsByClassName("completed-icon");
  const completedIconsArray = Array.from(completedIcons);

  const uncompletedIcons = document.getElementsByClassName("circle-normal");
  const uncompletedIconsArray = Array.from(uncompletedIcons);

  const checkboxStatus = document.getElementsByClassName("setup-guide-status");
  const checkboxStatusArray = Array.from(checkboxStatus);

  const progressBar = document.getElementById("progress-bar");
  const progressBarText = document.getElementById("number-completed");

  //handle closing the trial prompt
  const handleCloseCTA = () => {
    document.getElementById("cta").style.visibility = "hidden";
  };
  closeBtn.addEventListener("click", handleCloseCTA);

  //handle notification toggle
  const handleShowAlert = () => {
    const isExpanded =
      notificationBarToggle.attributes["aria-expanded"].value === "true";
    notificationBar.classList.toggle("notification-alert-active");
    if (isExpanded) {
      notificationBarToggle.ariaExpanded = "false";
    } else {
      notificationBarToggle.ariaExpanded = "true";
    }
  };
  notificationBarToggle.addEventListener("click", handleShowAlert);

  //handle menu toggle
  const handleMenuToggle = () => {
    const isExpanded = menuToggle.attributes["aria-expanded"].value === "true";
    menu.classList.toggle("menu-active");
    const menuItems = document.getElementsByClassName("menu-item");
    const firstItem = Array.from(menuItems)[0];

    //declare expanded state of menu for screen readers
    if (isExpanded) {
      menuToggle.ariaExpanded = "false";
      menuToggle.focus();
    } else {
      menuToggle.ariaExpanded = "true";
      firstItem.focus();
    }

    //close menu when esc key is pressed
    menu.addEventListener("keyup", function (event) {
      if (event.key === "Escape") {
        menu.classList.remove("menu-active");
        menuToggle.focus();
      }
    });
    menuToggle.addEventListener("keyup", function (event) {
      if (event.key === "Escape") {
        menu.classList.remove("menu-active");
        menuToggle.focus();
      }
    });

    //listen for keyup events on all menu items, for keypad navigation
    Array.from(menuItems).forEach((menuItem, menuItemIndex) => {
      menuItem.addEventListener("keyup", function (event) {
        const isLastItem = menuItemIndex === Array.from(menuItems).length - 1;
        const isFirstItem = menuItemIndex === 0;
        const nextItemIndex = menuItemIndex + 1;
        const prevItemIndex = menuItemIndex - 1;
        const lastItemIndex = Array.from(menuItems).length - 1;

        const nextItem = Array.from(menuItems)[nextItemIndex];
        const prevItem = Array.from(menuItems)[prevItemIndex];

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          if (isLastItem) {
            Array.from(menuItems)[0].focus();
            return;
          }
          nextItem.focus();
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          if (isFirstItem) {
            Array.from(menuItems)[lastItemIndex].focus();
            return;
          }
          prevItem.focus();
        }
      });
    });
  };
  menuToggle.addEventListener("click", handleMenuToggle);

  //handle displaying setup guide
  //show down arrow if collapsed and up arrow if expanded
  if (showGuideState !== "block") {
    guideDownArrow.style.display = "block";
    guideUpArrow.style.display = "none";
  }

  const handleShowGuide = () => {
    document.getElementById("setup-guide-open").style.display = "block";
    guideDownArrow.style.display = "none";
    guideUpArrow.style.display = "block";
  };
  guideDownArrow.addEventListener("click", handleShowGuide);

  const handleHideGuide = () => {
    document.getElementById("setup-guide-open").style.display = "none";
    guideDownArrow.style.display = "block";
    guideUpArrow.style.display = "none";
  };
  guideUpArrow.addEventListener("click", handleHideGuide);

  //loop through setup guide items, and add click event listeners
  setupGuideItemsArray.forEach((setupGuideItem, setupItemIndex) => {
    setupGuideItem.addEventListener("click", () => {
      //for each item, get an array of other items(excluding current item), and loop through to remove active class
      for (i = 0; i < setupGuideItemsArray.length; i++) {
        if (i !== setupItemIndex) {
          setupGuideItemsArray[i].classList.remove("active");
        }
      }
      //add active class to current item only
      setupGuideItem.classList.add("active");
    });
  });

  //handle checkbox and progress bar
  let checkedItemsNo = 0;
  progressBarText.innerHTML = checkedItemsNo + " / 5 completed";
  checkboxesArray.forEach((checkbox, checkbokIndex) => {
    checkbox.addEventListener("click", () => {
      const markedAsDone = checkbox.classList.contains(MARKED_AS_DONE);
      const activeSpinner = loadingSpinnersArray[checkbokIndex];
      const activeCompletedIcon = completedIconsArray[checkbokIndex];
      const activeUncompletedIcon = uncompletedIconsArray[checkbokIndex];

      const prevCheck = checkboxesArray[checkbokIndex - 1];
      const nextCheck = checkboxesArray[checkbokIndex + 1];

      const handleMarkAsdone = () => {
        activeUncompletedIcon.classList.add("hidden");
        activeUncompletedIcon.classList.remove("show");

        activeSpinner.classList.remove("hidden");
        activeSpinner.classList.add("active");

        checkboxStatusArray[checkbokIndex].ariaLabel = "Loading.Please wait...";

        setTimeout(() => {
          activeSpinner.classList.add("hidden");
          activeSpinner.classList.remove("active");

          activeCompletedIcon.classList.remove("hidden");
          activeCompletedIcon.classList.add("show");

          checkbox.ariaLabel = checkbox.ariaLabel.replace(
            "as done",
            "as not done"
          );
          checkboxStatusArray[checkbokIndex].ariaLabel =
            "Successfully marked clean your room as done";

          checkbox.classList.add(MARKED_AS_DONE);

          //update progress bar to add checked item
          progressBarText.innerHTML = checkedItemsNo + 1 + " / 5 completed";
          checkedItemsNo++;
        }, 1000);
      };

      const handleMarkAsNotDone = () => {
        activeCompletedIcon.classList.remove("show");
        activeCompletedIcon.classList.add("hidden");

        activeSpinner.classList.add("active");
        activeSpinner.classList.remove("hidden");

        checkboxStatusArray[checkbokIndex].ariaLabel = "Loading.Please wait...";

        setTimeout(() => {
          activeSpinner.classList.add("hidden");
          activeSpinner.classList.remove("active");

          activeUncompletedIcon.classList.add("show");
          activeUncompletedIcon.classList.remove("hidden");

          checkbox.ariaLabel = checkbox.ariaLabel.replace(
            "as not done",
            "as done"
          );

          checkboxStatusArray[checkbokIndex].ariaLabel =
            "Successfully marked clean your room as not done";

          checkbox.classList.remove(MARKED_AS_DONE);

          //update progress bar to remove unchecked item
          progressBarText.innerHTML = checkedItemsNo - 1 + " / 5 completed";
          checkedItemsNo--;
        }, 1000);
      };

      //prevent a user from marking item as done if previous item is not checked
      if (checkbokIndex !== 0 && !prevCheck.classList.contains(MARKED_AS_DONE))
        return;

      if (markedAsDone) {
        //prevent user from marking item as not done if next item is still checked
        if (checkbokIndex !== 4 && nextCheck.classList.contains(MARKED_AS_DONE))
          return;
        handleMarkAsNotDone();
      } else {
        handleMarkAsdone();
      }
    });
  });
}

app();

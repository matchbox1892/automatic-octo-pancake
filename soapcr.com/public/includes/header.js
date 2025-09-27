(function ($) {
  const $mask = $("#HDR_mask");
  const $menu = $("#HDR_mainmenu");

  function openMenu() {
    $mask.stop(true, true).fadeTo(150, 0.4).css("display", "block");
    $menu.addClass("is-open").show();
  }

  function closeMenu() {
    $menu.removeClass("is-open").hide();
    $mask.stop(true, true).fadeOut(150, function () {
      $(this).css({ opacity: 0, display: "none" });
    });
  }

  function toggleMenu() {
    if ($menu.is(":visible")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  $(function () {
    closeMenu();

    $("#HDR_menuicon").on("click", toggleMenu);
    $("#HDR_menu_cancel").on("click", closeMenu);
    $("#HDR_menulist").on("click", "li, a", closeMenu);
    $mask.on("click", closeMenu);

    $(document).on("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  });

  window.headerMenu = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu
  };
})(window.jQuery);

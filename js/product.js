tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#1da64a",
          darkgreen: "#10562e",
          topbar: "#1aa349",
          gold: "#eab308",
          amber: "#f59e0b",
          badge: "#eb5757",
          bglight: "#f9fbf9",
          softgray: "#f4f5f7",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Quantity Selector
  const minusBtn = document.getElementById("qty-minus");
  const plusBtn = document.getElementById("qty-plus");
  const quantityValue = document.getElementById("qty-value");

  if (minusBtn && plusBtn && quantityValue) {
    plusBtn.addEventListener("click", () => {
      let current = parseInt(quantityValue.textContent);
      quantityValue.textContent = current + 1;
    });

    minusBtn.addEventListener("click", () => {
      let current = parseInt(quantityValue.textContent);
      if (current > 1) {
        quantityValue.textContent = current - 1;
      }
    });
  }

  // 2. Tabs logic
  const tabs = document.querySelectorAll(".tab-headers button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Need to hide others since it was not properly setup in HTML
  const descContent = document.getElementById("desc");

  // Create additional content divs if they don't exist
  let addContent = document.getElementById("add");
  if (!addContent) {
    addContent = document.createElement("div");
    addContent.id = "add";
    addContent.className =
      "space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed max-w-5xl mx-auto tab-content hidden";
    addContent.innerHTML =
      "<p>Additional information like weight, dimensions, and pot specifications will be listed here.</p>";
    descContent.parentNode.insertBefore(addContent, descContent.nextSibling);
  }

  let revContent = document.getElementById("rev");
  if (!revContent) {
    revContent = document.createElement("div");
    revContent.id = "rev";
    revContent.className =
      "space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed max-w-5xl mx-auto tab-content hidden";
    revContent.innerHTML =
      "<p>Customer reviews and ratings for this product.</p>";
    descContent.parentNode.insertBefore(revContent, addContent.nextSibling);
  }

  const allTabContents = [descContent, addContent, revContent];

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      // Remove active class from all tabs
      tabs.forEach((t) => {
        t.classList.remove("text-[#1aa349]", "border-b-2", "border-[#1aa349]");
        t.classList.add("text-gray-400");
      });
      // Add active class to clicked tab
      e.target.classList.remove("text-gray-400");
      e.target.classList.add(
        "text-[#1aa349]",
        "border-b-2",
        "border-[#1aa349]",
      );

      // Hide all contents
      allTabContents.forEach((content) => {
        if (content) content.classList.add("hidden");
      });

      // Show target content
      const targetId = e.target.getAttribute("data-target");
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.remove("hidden");
      }
    });
  });

  // 3. FAQ Accordion Logic
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      const icon = item.querySelector("i");
      if (icon.classList.contains("fa-chevron-down")) {
        icon.classList.replace("fa-chevron-down", "fa-chevron-up");
      } else {
        icon.classList.replace("fa-chevron-up", "fa-chevron-down");
      }
    });
  });

  // 4. Image Gallery Logic
  const mainImg = document.getElementById("main-product-img");
  const thumbnails = document.querySelectorAll(".thumb-btn img");

  thumbnails.forEach((thumb) => {
    thumb.parentElement.addEventListener("click", () => {
      mainImg.src = thumb.src;
      // Update active state border
      thumbnails.forEach((t) => {
        t.parentElement.classList.remove("border-2", "border-green-500");
        t.parentElement.classList.add("border", "border-gray-200");
      });
      thumb.parentElement.classList.remove("border", "border-gray-200");
      thumb.parentElement.classList.add("border-2", "border-green-500");
    });
  });

  // 5. Option Selectors (Size, Material, Color)
  const optionGroups = document.querySelectorAll(".option-group");
  optionGroups.forEach((group) => {
    const buttons = group.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("bg-[#f59e0b]", "text-white", "shadow-sm");
          b.classList.add(
            "border",
            "border-gray-300",
            "text-gray-700",
            "bg-white",
          );
        });
        btn.classList.remove(
          "border",
          "border-gray-300",
          "text-gray-700",
          "bg-white",
        );
        btn.classList.add("bg-[#f59e0b]", "text-white", "shadow-sm");
      });
    });
  });

  const colorGroups = document.querySelectorAll(".color-group span");
  colorGroups.forEach((color) => {
    color.addEventListener("click", () => {
      colorGroups.forEach((c) => {
        c.classList.remove("border-white", "ring-2", "ring-emerald-500");
        c.classList.add("border-transparent");
      });
      color.classList.remove("border-transparent");
      color.classList.add("border-white", "ring-2", "ring-emerald-500");
    });
  });
});

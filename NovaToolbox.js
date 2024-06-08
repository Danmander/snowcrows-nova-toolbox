document.novaToolbox = {
	// Add id labels to all blocks which are used in the moving script
	addRepeaterIdLabels: function () {
		document.novaToolbox.removeRepeaterIdLabels();

		// Add repeater id divs to all repeater blocks
		let allRepeaters = document.querySelectorAll("[data-repeater-id]");
		allRepeaters.forEach(repeater => {
			let div = document.createElement("div");
			div.id = "novaToolboxRepeaterId";
			div.innerHTML = `Repeater id: ${repeater.dataset.repeaterId}`;
			repeater.firstChild.insertBefore(div, repeater.firstChild.childNodes.item(1));
		});
	},

	// remove all repeater id labels
	removeRepeaterIdLabels: function () {
		document.querySelectorAll("#novaToolboxRepeaterId").forEach((div) => div.remove());
	},

	// Move a repeater block underneath another repeater block
	moveRepeaterUnderneathRepeater: function (repeaterId, targetRepeaterId) {
		// Just a saveguard to not infinitely move a repeater block
		if (repeaterId === targetRepeaterId) {
			console.log("Trying to move a block underneath itself?");
			return;
		}

		// Prepare everything we need to start moving
		let targetRepeater = document.querySelector(`[data-repeater-id='${targetRepeaterId}']`);
		let repeater = document.querySelector(`[data-repeater-id='${repeaterId}']`);
		let direction = targetRepeater.getBoundingClientRect().y < repeater.getBoundingClientRect().y ? "up" : "down";
		let repeaterMoveButton = repeater.querySelector(`[dusk='row-move-${direction}-button']`);

		// Start moving
		function move(repeater, targetRepeater, button) {
			if (targetRepeater.nextSibling === repeater) {
				alert("Done moving!");
				return;
			};

			// Keep moving the block
			button.click();
			setTimeout(() => {
				move(repeater, targetRepeater, button);
			}, 1)
		}
		move(repeater, targetRepeater, repeaterMoveButton);
	},

	// Open/close toolbox menu
	collapseToolboxMenu: function () {
		let toolboxMenuBody = document.querySelector("#novaToolboxMenu #novaToolboxMenuBody");
		toolboxMenuBody.style.height = 0;
		toolboxMenuBody.style.overflow = "hidden";
	},
	expandToolboxMenu: function () {
		let toolboxMenuBody = document.querySelector("#novaToolboxMenu #novaToolboxMenuBody");
		toolboxMenuBody.style.height = null;
		toolboxMenuBody.style.overflow = null;
	}
}

// Create toolbox menu
{
	// Delete existing menus so we don't double load the script
	document.querySelectorAll("#novaToolboxMenu").forEach((menu) => menu.remove());

	// Create a new menu
	let toolboxMenu = document.createElement("div");
	toolboxMenu.id = "novaToolboxMenu";
	toolboxMenu.style.cssText = `
		position: fixed;
		bottom: 0px;
		right: 0px;
		border: 1px solid #ccc;
		padding: 10px;
		z-index: 9999;
		max-width: 300px;
	`;
	toolboxMenu.classList = "rounded-lg shadow bg-white dark:bg-gray-800";

	// Helper variable so we don't have to write classes out multiple times
	let buttonClasses = "bg-primary-500 rounded text-white px-4 text-sm";
	let inputClasses = "form-control form-input form-control-bordered";

	toolboxMenu.innerHTML = `
		<div class="text-xl font-bold">
			Nova Toolbox (by Dán)
			<button id="collapseToolboxMenuButton">−</button>
			<button id="expandToolboxMenuButton">◻</button>
		</div>
		<div id="novaToolboxMenuBody">
			<div class="text-lg">Repeater Ids</div>
			<button id="removeRepeaterIdsButton" class="${buttonClasses}">Hide</button>
			<button id="addRepeaterIdsButton" class="${buttonClasses}">Show</button>

			<div class="text-lg mt-6">Moving Repeater Blocks</div>
			<label>Subject Repeater Id</label>
			<input id="repeaterIdInput" class="${inputClasses}"/>
			<label>Target Repeater Id</label>
			<input id="targetRepeaterIdInput" class="${inputClasses}"/>
			<button id="moveButton" class="${buttonClasses} mt-3">Move Subject underneath Target</button>
		</div>
	`;
	document.body.appendChild(toolboxMenu);

	// Add button logic
	toolboxMenu.querySelector("#moveButton").addEventListener("click", () => {
		let repeaterId = document.getElementById("repeaterIdInput").value;
		let targetRepeaterId = document.getElementById("targetRepeaterIdInput").value;
		document.novaToolbox.moveRepeaterUnderneathRepeater(repeaterId, targetRepeaterId);
	});
	toolboxMenu.querySelector("#removeRepeaterIdsButton").addEventListener("click", document.novaToolbox.removeRepeaterIdLabels);
	toolboxMenu.querySelector("#addRepeaterIdsButton").addEventListener("click", document.novaToolbox.addRepeaterIdLabels);
	toolboxMenu.querySelector("#collapseToolboxMenuButton").addEventListener("click", document.novaToolbox.collapseToolboxMenu);
	toolboxMenu.querySelector("#expandToolboxMenuButton").addEventListener("click", document.novaToolbox.expandToolboxMenu);
}
(function ($) {

	$.fn.repeatable = function (userSettings) {

		/**
		 * Default settings
		 * @type {Object}
		 */
		var defaults = {
			addTrigger: ".add",
			deleteTrigger: ".delete",
			max: null,
			startWith: 0,
			template: null,
			itemContainer: ".field-group",
			onAdd: function () {},
			onDelete: function () {}
		};

		/**
		 * Iterator used to make each added
		 * repeatable element unique
		 * @type {Number}
		 */
		var i = 0;
		
		/**
		 * DOM element into which repeatable
		 * items will be added
		 * @type {jQuery object}
		 */
		var target = $(this);
			
		/**
		 * Blend passed user settings with defauly settings
		 * @type {[type]}
		 */
		var settings = $.extend({}, defaults, userSettings);
		
		/**
		 * Total templated items found on the page
		 * at load. These may be created by server-side
		 * scripts.
		 * @return null
		 */
		var total = function () {
			return $(target).find(settings.itemContainer).length;
		}();

		
		/**
		 * Add an element to the target
		 * and call the callback function
		 * @return null
		 */
		var addOne = function () {
			createOne();
			settings.onAdd.call(this);
		};

		/**
		 * Delete the parent element
		 * and call the callback function
		 * @return null
		 */
		var deleteOne = function () {
			$(this).parents(settings.itemContainer).first().remove();
			total--;
			maintainAddBtn();
			settings.onDelete.call(this);
		};

		/**
		 * Add an element to the target
		 * @return null
		 */
		var createOne = function() {
			getUniqueTemplate().appendTo(target);
			total++;
			maintainAddBtn();
		};

		/**
		 * Alter the given template to make
		 * each form field name unique
		 * @return {jQuery object}
		 */
		var getUniqueTemplate = function () {
			var template = $(settings.template).html();
			template = template.replace(/{\?}/g, "new" + i++); 	// {?} => iterated placeholder
			template = template.replace(/\{[^\?\}]*\}/g, ""); 	// {valuePlaceholder} => ""
			return $(template);
		};

		/**
		 * Determines if the add trigger
		 * needs to be disabled
		 * @return null
		 */
		var maintainAddBtn = function () {
			if (!settings.max) {
				return;
			}

			if (total === settings.max) {
				$(settings.addTrigger).attr("disabled", "disabled");
			} else if (total < settings.max) {
				$(settings.addTrigger).removeAttr("disabled");
			}
		};

		/**
		 * Setup the repeater
		 * @return null
		 */
		(function () {
			$(settings.addTrigger).on("click", addOne);
			$("form").on("click", ".delete", deleteOne);

			if (!total) {
				var toCreate = settings.startWith - total;
				for (var j = 0; j < toCreate; j++) {
					createOne();
				}
			}
			
		})();
	};

})(jQuery);
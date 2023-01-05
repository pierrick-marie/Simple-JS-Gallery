/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2023, pierrick
 * All rights reserved.
 **/

const GALLERY	= 'simple-js-gallery';		// the id of the main section of the gallery
const IMAGES 	= `${GALLERY}-images`;		// the id of images section
const THUMBNAILS 	= `${GALLERY}-thumbnails`;	// the id of thumbnails section
const TITLE 	= `${GALLERY}-title`;		// the id of title section
const ARROWS 	= `${GALLERY}-arrows`;		// the id of arrows section

var CURRENT_IMAGE_NUMBER 	= 0;		// the number of the current image displayed on the screen
var NB_IMAGES 			= 0;		// the total number of images
var IS_FULL_SCREEN_MODE 	= false;	// save whether the image is displayed in full screen or not

$(document).ready(function () {

	setupGallerySections(); // Setup title, arrows and thumbnails sections

	setupImages(); 		// Configure images section

	setupKeyboardBinding(); // Setup keyboard binding
});

/**
 * Init the sections: title, arrows and thumbnails
 */
function setupGallerySections() {

	setupTitlesSection(); 		// Add a section for the titles

	setupArrows(); 			// Setup left and right arrow to navigate between the images 

	setupThumbnailsSection();	// Add a section for the thumbnails
}

/**
 * Setup all images in the gallery:
 * 	- init global var NB_IMAGES
 * 	- add class fullScreenOff and shadow
 * 	- hide all images except the first
 * 	- add id to all images
 */
function setupImages() {

	NB_IMAGES = $(`#${IMAGES} img`).length;	// Count number of images to display

	$(`#${IMAGES} img`).addClass('fullScreenOff').addClass('shadow');	// Add classes fullScreenOff and shadow to all images

	$(`#${IMAGES} img:not(:first-child)`).hide();	// Hide all images except the first

	$(`#${IMAGES} img`).each(function () {		// For each images
		$(this).click(toggleFullScreenMode);	// Call toggleFullScreenMode function on click to the main image
	});

	setupImagesId(); // Setup images id
}

/**
 * Configure the section for thumbnails
 */
function setupThumbnailsSection() {

	$(`#${IMAGES}`).after(`<section id="${THUMBNAILS}"></section>`);	// Add a section for thumbnails after the images

	setupThumbnailImages();	// Clone images in the section ${THUMBNAILS}
}

/**
 * Add a section that will contain the title of the current image
 * Setup the title with attribut from the first image
 */
function setupTitlesSection() {

	const _titleValue = $(`#${IMAGES} img:not(:first-child)`).attr('title');	// Get title of the first image

	$(`#${GALLERY}`).prepend(`<h1 id="${TITLE}">${_titleValue}</h1>`);	// Insert h1 section
}

/**
 * Add left and right arrows to navigate between the images
 * ! Be sure the section for titles is correctly enabled before !
 */
function setupArrows() {
	
	const _leftArrow = `${GALLERY}-left-arrow`;	// Id of left arrow
	const _rightArrow = `${GALLERY}-right-arrow`;	// Id of right arrow

	$(`#${TITLE}`).after(`
		<img id="${_leftArrow}" class="${ARROWS}" src="./img/utils/left.png"/>
		<img id="${_rightArrow}" class="${ARROWS}" src="./img/utils/right.png"/>
	`);	// Insert the arrows

	$(`#${_leftArrow}`).click(leftArrowClicked);	// Call leftArrowClicked function on click to the left arrow
	$(`#${_rightArrow}`).click(rightArrowClicked);	// Call rightArrowClicked function on click to the right arrow
}

/**
 * Add event handler on left, right and escape key to change current image
 */
function setupKeyboardBinding() {

	$(document).keydown(function (event) {
		if (event.which == 37) { 	// left key
			leftArrowClicked();	// display left image
		} else {
			if (event.which == 39) { 	// right key
				rightArrowClicked();	// display right image
			} else {
				if (event.which == 27 && IS_FULL_SCREEN_MODE == true) { // escape key && in full screen mode
					toggleFullScreenMode(); // toggle to default view mode
				} else {
					if (event.which == 70) { 	// f key 
						toggleFullScreenMode();	// switch full screen / default view mode
					}
				}
			}
		}
	});
}

/**
 * Setup thumbnails of images
 * It clones all images in '.thumbnails' class.
 * Then it adds an id like #thumbnail-{number}
 *  where {number} starts from 0 to the number of images
 * Finally it adds '.cursorPointer' class to all images except the first
 */
function setupThumbnailImages() {

	const _thumbnailId = `${GALLERY}-thumbnail-`;	// Id of thumbnail
	var index = 0;

	$(`#${IMAGES} img`).each(function () {
		$(`#${THUMBNAILS}`).append(
			$(this).clone()
				.attr('id', _thumbnailId.concat(index))		// Add id #thumbnails-{index}
				.click({ id: index }, callChangeMainImage) 	// on click to a thumbnails, call function to display the new image
		);
		index++;
	});

	$(`#${THUMBNAILS} img:not(:first-child)`).addClass('cursorPointer'); // Add '.cursorPointer' class to all images except the first
}

/**
 * Setup id for each images
 * ids are: #images-{number}
 * {number} starts at 0 and increase to the number of images
 */
function setupImagesId() {

	const _imageId = `${GALLERY}-image`; // Id of images

	var index = 0;

	$(`#${IMAGES} img`).each(function () {
		$(this).attr('id', `${_imageId}-${index}`); // Add id #image-{index}
		index++;
	});
}

/**
 * Get index number from event parameter and call changeMainImage.
 * This function have to be called from click on thumbnails
 */
function callChangeMainImage(event) {
	changeMainImage(event.data.id);
}

/**
 * Display next image
 */
function changeMainImage(newIndex) {

	if (CURRENT_IMAGE_NUMBER != newIndex) {

		const _image = `#${GALLERY}-image`;			// Id of images
		const _thumbnail = `#${GALLERY}-thumbnail`;	// Id of thumbnails

		const _newImageId = `${_image}-${newIndex}`; 		// Compute new index of #image-
		const _newThumbnailId = `${_thumbnail}-${newIndex}`;	// Compute new index of #thumbnail-

		const _currentImageId = `${_image}-${CURRENT_IMAGE_NUMBER}`;		// Compute current index of is #image-
		const _currentThumbnailId = `${_thumbnail}-${CURRENT_IMAGE_NUMBER}`;	// Compute current index of is #thumbnail-

		CURRENT_IMAGE_NUMBER = newIndex;	// update currentIndex with new value

		$(_currentImageId).hide();	// hide previous image
		$(_newImageId).show(); 		// display new image


		if (IS_FULL_SCREEN_MODE == true) {
			displayFullScreenMode();
		} else {
			displayDefaultView();
		}

		$(_currentThumbnailId).removeClass('shadow').removeClass('cursorDefault').addClass('cursorPointer');	// change skin of current thumbnail
		$(_newThumbnailId).addClass('shadow').addClass('cursorDefault').removeClass('cursorPointer'); 		// change skin of new selected thumbnail

		$(`#${TITLE}`).html($(_newImageId).attr('title')); // Update title
	}
}

/**
 * Get index of previous image
 */
function leftArrowClicked() {

	var index = CURRENT_IMAGE_NUMBER - 1;

	if (index < 0) {
		index = NB_IMAGES - 1;
	}

	changeMainImage(index);
}

/**
 * Get index of next image
 */
function rightArrowClicked() {

	var index = CURRENT_IMAGE_NUMBER + 1;

	if (index >= NB_IMAGES) {
		index = 0;
	}

	changeMainImage(index);
}

/**
 *  Toggle image in full screen or back in default view
 */
function toggleFullScreenMode() {

	if (IS_FULL_SCREEN_MODE == false) { // display image in full screen mode
		displayFullScreenMode();
		IS_FULL_SCREEN_MODE = true;

	} else { // display image in default mode
		displayDefaultView();
		IS_FULL_SCREEN_MODE = false;
	}
}


/**
 * Display image in full screen mode
 */
function displayFullScreenMode() {

	const _currentImageId = `#${GALLERY}-image-${CURRENT_IMAGE_NUMBER}`;

	$(_currentImageId).removeClass('fullScreenOff'); // switch CSS of current image from default view mode to full screen mode
	$(_currentImageId).addClass('fullScreenOn');

	$('body').addClass('backgroundBlack'); // change background to black

	$(`#${THUMBNAILS}`).hide();	// hide thumbnails
	$(`.${ARROWS}`).hide(); 	// hide arrows
	$(`#${TITLE}`).hide(); 		// hide titles
}

/**
 * Display image in default view
 */
function displayDefaultView() {

	const _currentImageId = `#${GALLERY}-image-${CURRENT_IMAGE_NUMBER}`;

	$(_currentImageId).removeClass('fullScreenOn'); // switch CSS of current image from full screen view mode to full default mode
	$(_currentImageId).addClass('fullScreenOff');

	$('body').removeClass('backgroundBlack'); 	// remove black background

	$(`#${THUMBNAILS}`).css('display', 'flex');	// display thumbnails
	$(`.${ARROWS}`).show();	// display arrows
	$(`#${TITLE}`).show();	// display titles
}

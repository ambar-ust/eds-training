import { div, input, label, h4, span, img, i, a } from '../../scripts/dom-helpers.js';
import { fetchProductData } from '../../scripts/common.js';
import { getSiteUrl } from '../../scripts/config.js';

let currentFrame = 0;

const rotateFrame = (rotateUrlString, imgEl, direction = 1) => {
  const imgRotateUrls = rotateUrlString;
  const totalFrames = imgRotateUrls.length;
  currentFrame = (currentFrame + direction + totalFrames) % totalFrames;
  imgEl.src = imgRotateUrls[currentFrame].url;
};

/**
 * Utility to create a button with an optional icon
 * @param {HTMLElement} element - The root element containing <p> and <a> tags
 * @returns {HTMLElement|null} - The constructed button element
 */
function createButton(element, btnClass) {
  if (!element) return null;

  const pTags = element.querySelectorAll('p');
  const link = element.querySelector('a');
  const firstP = pTags[0];
  const lastP = pTags[pTags.length - 1];
  const iconClass = pTags.length === 3 ? lastP.textContent.trim() : '';

  // Build the button's children array dynamically
  const buttonChildren = [firstP?.textContent?.trim() || ''];

  // Add the <i> element only if iconClass exists
  if (iconClass) {
    buttonChildren.push(i({ class: `hero-icon ${iconClass}` }));
  }

  return a(
    {
      href: link?.textContent || '#',
      target: '_blank',
      class: btnClass,
      'aria-label': firstP?.textContent?.trim() || '',
    },
    ...buttonChildren, // Spread children (text + optional <i>)
  );
}

export default async function decorate(block) {
  const props = Array.from(block.children).map((ele) => ele.children);
  // check whether content is available or not. If not return the block
  const root = props?.[0]?.[0];
  if (!root) return;
  // Grab the theme of the component.
  const themeName = root.querySelector('p')?.textContent?.trim() || '';
  // Grab the component Heading.
  const blockHeading = root.querySelector('h2') || '';

  const pTags = root.querySelectorAll('p') || [];
  const notesInfo = pTags.length >= 2 ? pTags[pTags.length - 3]?.textContent?.trim() : '';

  const swatchShape = pTags[pTags.length - 1]?.textContent || 'circle';

  const buttonContainer = root.querySelector('p.button-container');
  // Get the authored API Url.
  const apiUrl = buttonContainer?.textContent?.trim() || '';
  props.shift(); // Remove the first item, since the remaining items are buttons

  // Only create button if props[0] and props[0][0] exist
  const primaryButton = props?.[0]?.[0].innerHTML
    ? createButton(props[0][0], 'button-primary-large')
    : '';

  // Only create button if props[1] and props[1][0] exist
  const secondaryButton = props?.[1]?.[0].innerHTML
    ? createButton(props[1][0], 'button-secondary-large')
    : '';

  block.innerHTML = '';

  block.append(div({ class: `${themeName} overview-theme-wrapper` }));
  // Create wrapper for the whole block to add the theme class name
  const wrapper = document.querySelector('.overview-theme-wrapper');
  wrapper.append(div({ class: 'inner-theme-wrapper' }));
  const innerWrapper = document.querySelector('.inner-theme-wrapper');
  innerWrapper.append(blockHeading);

  innerWrapper.append(
    div({ class: 'bike-selector-main-wrapper' }, div({ class: 'loading' }, span('Loading...'))),
  );

  const componentFooter = div(
    { class: 'overview-bottom' },
    div({ class: 'notes-info' }, span(notesInfo)),
    div({ class: 'button-wrapper' }, secondaryButton, primaryButton),
  );
  innerWrapper.append(componentFooter);
  wrapper.append(innerWrapper);

  // API call the fetch the product dat.
  const response = await fetchProductData(apiUrl);

  const productInfo = response.data.products.items?.[0];
  const { variant_to_colors: variantsData, variants: allVariantsDetails } = productInfo;

  const initialVariantGroup = variantsData[0];
  const initialColor = initialVariantGroup.colors[0];

  const getVariantDetailsBySku = (sku) => allVariantsDetails.find((variant) => variant[sku])?.[sku];
  const dataMapping = { sku: initialColor.sku };

  const updateMainImage = (sku) => {
    const media = getVariantDetailsBySku(sku);
    const imgEl = block.querySelector(
      '.bike-selector-360-view  .hero-360 .hero-360 .spritespin-stage .rotate',
    );
    if (media?.product?.media_gallery?.length && imgEl) {
      imgEl.src = media.product.media_gallery[0].url;
    }
  };

  const updateActiveColorSwatch = (colorLabel) => {
    block
      .querySelectorAll('.color-option')
      .forEach((option) =>
        option.classList.toggle('active', option.querySelector('span').textContent === colorLabel),
      );
  };

  const renderColors = (colors, selectedLabel) => {
    const container = block.querySelector('.colors-container .color-wrapp');
    if (!container) return;

    container.innerHTML = '';

    colors.forEach(({ sku, label: colorLabel, color_swatch_url: colorSwatchUrl }) => {
      const option = div(
        {
          class: `color-option ${colorLabel === selectedLabel ? 'active' : ''}`,
          onClick: () => {
            dataMapping.sku = sku;

            updateMainImage(sku);
            updateActiveColorSwatch(colorLabel);
          },
        },
        span(colorLabel),
        img({
          class: `swatch-color ${swatchShape}`,
          loading: 'lazy',
          src: getSiteUrl(colorSwatchUrl),
          alt: colorLabel,
        }),
      );
      container.append(option);
    });
  };

  const handleVariantChange = (e) => {
    const selectedValueIndex = Number(e.target.value);
    block.querySelectorAll('.bike-form-control').forEach((el) => el.classList.remove('active'));
    e.target.closest('.bike-form-control').classList.add('active');

    const selectedGroup = variantsData.find((v) => v.value_index === selectedValueIndex);
    if (selectedGroup) {
      const { sku, label: colorLabel } = selectedGroup.colors[0];
      dataMapping.sku = sku;
      updateMainImage(sku);
      renderColors(selectedGroup.colors, colorLabel);
    }
  };

  const variantsDOM = div(
    { class: 'bike-selector-variants-wrapper' },
    div(
      { class: 'variants-wrap' },
      div({ class: 'text' }, 'Variants'),
      div(
        { class: 'radio-wrap' },
        ...variantsData.map(
          ({ value_index: valueIndex, label: variantLabel, variant_price: variantPrice }) => {
            const isActive = initialVariantGroup.value_index === valueIndex;
            const radioProps = {
              class: 'input-radio',
              type: 'radio',
              id: valueIndex,
              name: 'variants',
              value: valueIndex,
              onChange: handleVariantChange,
            };
            if (isActive) radioProps.checked = true;

            return div(
              { class: `bike-form-control  ${isActive ? 'active' : ''}` },
              div(
                { class: 'price-txt-wrap' },
                input(radioProps),
                label({ for: valueIndex, class: '' }, span(variantLabel)),
                div({ class: 'price-sec' }, span(`( ₹ ${variantPrice.toLocaleString('en-IN')} )`)),
              ),
            );
          },
        ),
      ),
    ),
  );

  const {
    product: {
      media_gallery: [firstImage],
    },
  } = getVariantDetailsBySku(initialColor.sku);

  const imageDom = div(
    { class: 'bike-selector-360-view' },
    div(
      { class: 'hero-360 w-100' },
      div(
        { class: 'rotate-images' },
        i({ class: 'hero-icon heroicon-rotate-left' }),
        i({ class: 'hero-icon heroicon-rotate-right' }),
      ),
      div(
        { class: 'hero-360' },
        div(
          { class: 'spritespin-stage' },
          img({
            class: 'rotate',
            src: firstImage.url,
            width: '490',
            height: '350',
          }),
        ),
      ),
      div({ class: 'hero-360__' }),
    ),
  );

  const colorsDiv = div(
    { class: 'colors-container' },
    h4({ class: 'mb-8 weight' }, 'Colours'),
    div({ class: 'color-wrapp' }),
  );

  block
    .querySelector('.bike-selector-main-wrapper')
    .replaceChildren(variantsDOM, imageDom, colorsDiv);

  const mainImage = block.querySelector('.bike-selector-360-view .rotate');
  const leftIcon = block.querySelector('.hero-icon.heroicon-rotate-left');
  const rightIcon = block.querySelector('.hero-icon.heroicon-rotate-right');

  renderColors(initialVariantGroup.colors, initialColor.label);

  if (leftIcon && rightIcon) {
    leftIcon.addEventListener('click', () => {
      const media = getVariantDetailsBySku(dataMapping.sku);
      const rotateUrls = media.product.media_gallery;
      rotateFrame(rotateUrls, mainImage, -1);
    });
    rightIcon.addEventListener('click', () => {
      const media = getVariantDetailsBySku(dataMapping.sku);
      const rotateUrls = media.product.media_gallery;
      rotateFrame(rotateUrls, mainImage, 1);
    });
  }
}

export default function decorate(block) {
  const title = block.querySelector(':scope > div:first-child > div')?.textContent?.trim();
  const parametersContainer = block.querySelector(':scope > div:nth-child(2)');

  // Clear the block
  block.innerHTML = '';

  // Add title if it exists
  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.className = 'title';
    titleElement.textContent = title;
    block.appendChild(titleElement);
  }

  // Create parameters container
  const parametersDiv = document.createElement('div');
  parametersDiv.className = 'parameters';

  // Process parameters
  if (parametersContainer) {
    const parameterRows = parametersContainer.querySelectorAll(':scope > div');

    parameterRows.forEach((row) => {
      const cells = row.querySelectorAll('div');
      if (cells.length >= 3) {
        const parameterItem = document.createElement('div');
        parameterItem.className = 'parameter-item';

        // Parameter name
        const parameterName = document.createElement('div');
        parameterName.className = 'parameter-name';
        parameterName.textContent = cells[0]?.textContent?.trim() || '';
        parameterItem.appendChild(parameterName);

        // Item 1 value
        const item1Value = document.createElement('div');
        item1Value.className = 'parameter-value item1-value';
        item1Value.textContent = cells[1]?.textContent?.trim() || '';
        parameterItem.appendChild(item1Value);

        // Item 2 value
        const item2Value = document.createElement('div');
        item2Value.className = 'parameter-value item2-value';
        item2Value.textContent = cells[2]?.textContent?.trim() || '';
        parameterItem.appendChild(item2Value);

        parametersDiv.appendChild(parameterItem);
      }
    });
  }

  block.appendChild(parametersDiv);
}

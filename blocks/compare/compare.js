export default function decorate(block) {
  // Get the title from the first row
  const titleRow = block.querySelector(':scope > div:first-child');
  const title = titleRow?.textContent?.trim();

  // Get the items container from the second row
  const itemsRow = block.querySelector(':scope > div:nth-child(2)');
  
  // Get any compareParameter blocks (they would be in subsequent rows)
  const parameterRows = block.querySelectorAll(':scope > div:nth-child(n+3)');

  // Clear the block
  block.innerHTML = '';

  // Add title if it exists
  if (title) {
    const titleElement = document.createElement('div');
    titleElement.className = 'compare-title';
    const titleHeader = document.createElement('h2');
    titleHeader.textContent = title;
    titleElement.appendChild(titleHeader);
    block.appendChild(titleElement);
  }

  // Process items
  if (itemsRow) {
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'compare-content';

    const itemCells = itemsRow.querySelectorAll(':scope > div');
    itemCells.forEach((cell, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = `compare-item compare-item-${index + 1}`;
      
      // Process item content (image, alt, name)
      const itemContent = cell.innerHTML;
      itemDiv.innerHTML = itemContent;
      
      itemsContainer.appendChild(itemDiv);
    });

    block.appendChild(itemsContainer);
  }

  // Process compareParameter blocks
  if (parameterRows.length > 0) {
    parameterRows.forEach((paramRow) => {
      // Check if this row contains compareParameter content
      const parameterDiv = document.createElement('div');
      parameterDiv.className = 'compare-parameters';
      parameterDiv.innerHTML = paramRow.innerHTML;
      block.appendChild(parameterDiv);
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("table").forEach(table => {
        table.querySelectorAll("tr").forEach((row, rowid) => {
            row.querySelectorAll("td").forEach((cell, cellid) => {
                if (cellid === 0) return;
                   
                const r = Array.from(table.querySelectorAll("tr"))[rowid];
                const rc = r.querySelector("td");
                const c = Array.from(Array.from(table.querySelectorAll("thead tr")).at(-1).querySelectorAll("th"))[cellid];

                cell.addEventListener("mouseenter", e => {
                    rc.style.textDecoration = "underline";
                    c.style.textDecoration = "underline";
                });

                cell.addEventListener("mouseleave", e => {
                    rc.style.textDecoration = "none";
                    c.style.textDecoration = "none";
                });
            });
        });
    });

    let clone = null;
    let overlay = null;

    document.querySelectorAll("div.plot img").forEach(img => {
        img.addEventListener("click", e => {

            if (clone) {
                console.log("Here");
                return;
            };

            clone = img.cloneNode();
            overlay = document.createElement("div");
            const close_button = document.createElement("span");
            close_button.classList.add("material-symbols-outlined", "close");
            close_button.innerText = "close";
            close_button.style.position = "fixed";
            close_button.style.top = "10px";
            close_button.style.right = "10px";
            close_button.style.cursor = "pointer";
            
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .5);
                z-index: 99;
            `;

            clone.style.cssText = `
                position: fixed;
                max-height: 90%;
                max-width: 90%;
                width: auto;
                height: auto;
                top: 50%;
                left: 50%;
                z-index: 99;
                transform: translate(-50%, -50%);
            `;

            clone.id = "image-popup";
            overlay.id = "overlay";
            overlay.appendChild(close_button);
            document.body.appendChild(overlay);
            document.body.appendChild(clone);

            overlay.addEventListener("click", handleOutsideClick);
            close_button.addEventListener("click", handleOutsideClick);

            clone.addEventListener("click", e => {
                e.stopPropagation();
            });

            
        });
    });

    function handleOutsideClick(e) {
        if (clone && !clone.contains(e.target)) {
            document.body.removeChild(clone);
            document.body.removeChild(overlay);
            clone = null;
            overlay.removeEventListener("click", handleOutsideClick);
            overlay = null;
        }
    }

    document.querySelector("div.logo").addEventListener("click", e => {
        location.href = location.origin;
    });
});

/**
 * 
 * @param {string} html 
 * @returns 
 */
function stripTags(html) {
    return html.replace(/<[^>]*>/g, "").replace(/&\w+;/g, " ");
}

/**
     * Display matrix.
     * @param {number[][]} matrix 
     */
function createMatrix(matrix, target = null, assign = null){
    let rows = matrix.length;
    let cols = matrix[0].length;
    let variableWidth = assign ? stripTags(assign).length + 3 : 0;
    
    if (matrix.some(x => x.length !== cols)) {
        console.error("Malformed matrix.");
        return null;
    }

    let maxWidth = Math.max(...matrix.flat().map(x => stripTags(x.toString()).length));
    let output = "&nbsp;".repeat(variableWidth) + "┌" + "&nbsp;".repeat(maxWidth*cols + cols + 1) + "┐<br>";

    output += `<span id="matrix-assignment">${assign} = </span>`;

    for (let i = 0; i < rows; i++){
        output += "&nbsp;".repeat(variableWidth) + "│&nbsp;" + matrix[i].map(x => `<span style="width:${maxWidth}ch; display: inline-block; line-height: .8;">` + x.toString().padStart(maxWidth, " ") + "</span>").join("&nbsp;") + "&nbsp;│<br>";
    }

    output += "&nbsp;".repeat(variableWidth) + "└" + "&nbsp;".repeat(maxWidth * cols + cols + 1) + "┘";

    const matrixContainer = document.createElement("div");
    matrixContainer.className = "matrix";
    matrixContainer.style.lineHeight = 1.2;
    matrixContainer.style.position = "relative";
    matrixContainer.innerHTML = output;

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    
    target.appendChild(matrixContainer);
}

/**
 * 
 * @param {string|number} num 
 * @param {string|number} den 
 */
function frac(num, den, target = null) {
    // ─
    num = typeof num === "number" ? String(num) : num;
    den = typeof den === "number" ? String(den) : den;

    let totalWidth = Math.max(stripTags(num.toString()).length, stripTags(den.toString()).length);

    let fractionContainer = document.createElement("span");
    fractionContainer.style.display = "inline-block";
    fractionContainer.style.alignItems = "center";
    fractionContainer.style.marginLeft = "3px";
    fractionContainer.style.marginRight = "3px";

    let fraction = document.createElement("span");
    if (num.startsWith("&radic;") || den.startsWith("&radic;")) fraction.style.whiteSpace = "no-wrap";
    fraction.style.display = "flex";
    fraction.className = "fraction";
    fraction.style.flexDirection = "column";
    fraction.style.alignItems = "center";

    let numerator = document.createElement("span");
    numerator.className = "fraction-numerator";
    let denominator = document.createElement("span");
    denominator.className = "fraction-denominator";
    let bar = document.createElement("span");
    bar.className = "fraction-bar";

    [numerator, denominator, bar].forEach(el => el.style.lineHeight = .8);

    numerator.innerHTML = num.startsWith("&radic;") ? `&radic;<span style="text-decoration: overline;">&nbsp;${num.replace("&radic;", "")}&nbsp;</span>` : num;
    denominator.innerHTML = den.startsWith("&radic;") ? `&radic;<span style="text-decoration: overline;">&nbsp;${den.replace("&radic;", "")}&nbsp;</span>` : den;
    bar.innerHTML = "─".repeat(num.startsWith("&radic;") || den.startsWith("&radic;") ? totalWidth + 1 : totalWidth);

    fraction.appendChild(numerator);
    fraction.appendChild(bar);
    fraction.appendChild(denominator);

    fractionContainer.appendChild(fraction);

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    
    target.appendChild(fractionContainer);
}

/**
 * Create superscript and subscript with whole or fractional part.
 * 
 * Example: `X^{A/B}_{C/D}`.
 * @param {{A: string|number, B: string|number, C: string|number, D: string|number}} indices 
 * @param {Element|null} target 
 */
function indexFrac({A = null, B = null, C = null, D = null}, target = null) {
    let index = document.createElement("span");
    index.style.display = "flex";
    index.style.flexDirection = "column";
    index.style.alignContent = "space-between";

    if (A && B){
        let frac = `<sup>${A}</sup>&frasl;<sub>${B}</sub>`;
        let fraction = document.createElement("span");
        fraction.innerHTML = frac;
        if (!C) fraction.style.marginBottom = "10px";
        fraction.style.fontSize = "10px";
        fraction.style.marginRight = "3px";
        index.appendChild(fraction);
    } else if (A && !B) {
        let fraction = document.createElement("span");
        fraction.innerHTML = A;
        if (!C) fraction.style.marginBottom = "10px";
        fraction.style.fontSize = "10px";
        fraction.style.marginRight = "3px";
        index.appendChild(fraction);
    }
    
    if (C && D) {
        let frac = `<sup>${C}</sup>&frasl;<sub>${D}</sub>`;
        let fraction = document.createElement("span");
        fraction.innerHTML = frac;
        if (!A) fraction.style.marginTop = "12px";
        fraction.style.fontSize = "10px";
        fraction.style.marginRight = "3px";
        index.appendChild(fraction);
    } else if (C && !D) {
        let fraction = document.createElement("span");
        fraction.innerHTML = C;
        if (!A) fraction.style.marginTop = "10px";
        fraction.style.fontSize = "10px";
        fraction.style.marginRight = "3px";
        index.appendChild(fraction);
    }

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    
    target.appendChild(index);
}

function sup(text, target = null) {
    text = typeof text === "number" ? String(text) : text;
    let sup = document.createElement("span");
    sup.innerHTML = text;
    sup.style.marginBottom = "10px";
    sup.style.fontSize = "10px";
    sup.style.marginRight = "3px";

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    
    target.appendChild(sup);
}

function cellDivider(lower, upper, maxWidth = 50, maxHeight = 30, target = null) {
    let table = document.createElement("div");
    lower = typeof lower === "number" ? lower.toString() : lower;
    upper = typeof upper === "number" ? upper.toString() : upper;
    maxWidth = Math.max(lower.length, upper.length) || maxWidth;
    table.style.width = maxWidth*2 + "ch";
    table.style.height = maxHeight*2 + "px";
    table.style.display = "grid";
    table.style.position = "relative";
    table.style.gridTemplateColumns = "1fr 1fr";
    table.style.gridTemplateRows = "1fr 1fr";

    let row = 1;
    for (let i = 0; i < 4; i++){
        let cell = document.createElement("div");
        cell.className = "inner-cell";
        cell.style.width = maxWidth + "ch";
        cell.style.height = maxHeight + "px";
        cell.style.gridColumn = `${i%2 + 1} / ${i%2 + 2}`;
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";

        if (i !== 0 && i % 2 === 0) {
            row++;
        }
        cell.style.gridRow = `${row} / ${row + 1}`;
        if (row === 1 && i%2 + 1 === 2){
            cell.innerHTML = upper;
        } else if (row === 2 && i%2 + 1 === 1) {
            cell.innerHTML = lower;
        }

        table.appendChild(cell);
    }

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }

    target.appendChild(table);

    let diagonal = document.createElement("div");
    const rect = table.getBoundingClientRect();
    target.removeChild(table);
    let diagonalLength = Math.sqrt(rect.width ** 2 + rect.height ** 2);
    diagonal.style.width =  diagonalLength + "px";
    diagonal.style.borderTop = "1px solid var(--dark-blue)";
    diagonal.style.position = "absolute";
    diagonal.style.top = "0"; 
    diagonal.style.left = "0"; 
    diagonal.style.transformOrigin = "0% 0%";
    let angle = Math.atan(rect.height / rect.width); 
    diagonal.style.transform = `rotate(${angle}rad)`;
    table.appendChild(diagonal);

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    target.appendChild(table);
    
}

function topBar(letter, target = null){
    let item = document.createElement("span");
    let bar = document.createElement("span");
    bar.innerHTML = "─".repeat(stripTags(letter).length);
    bar.style.position = 'absolute';
    bar.style.top = "-8px";
    bar.style.left = "50%";
    bar.style.transform = "translateX(-50%)";
    item.innerHTML = letter;
    item.style.position = "relative";

    item.appendChild(bar);

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    target.appendChild(item);
}

/**
 * 
 * @param {string} text 
 */
function redirect(text, redirect = "", maxWords = 20, target = null) {
    text = text.split(" ").slice(0, maxWords).join(" ") + "..." + `<a href="${redirect}">read more</a>`;

    let caption = document.createElement("p");
    caption.innerHTML = text;

    if (!target) {
        const scriptTag = document.currentScript;
        target = scriptTag.parentElement;
    }
    target.appendChild(caption);
}
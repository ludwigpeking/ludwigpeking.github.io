window.onload = function() {
    const column = document.querySelector('.container .column:nth-child(3)');
    for(let i = 1; i <= 6; i++) {
        const img = document.createElement('img');
        let imgNumber = i.toString().padStart(3, '0'); // pad the number with leading zeros
        img.src = `/img/img${imgNumber}.jpg`;
        column.appendChild(img);
    }
};

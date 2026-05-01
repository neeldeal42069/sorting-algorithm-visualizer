class SortingVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.array = [];
        this.sorting = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.speed = 50;
        this.colors = {
            default: '#667eea',
            comparing: '#ff6b6b',
            sorted: '#51cf66',
            pivot: '#ffd93d'
        };
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    generateArray(size) {
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * this.canvas.height));
        }
        this.comparisons = 0;
        this.swaps = 0;
        this.draw();
    }

    async delay() {
        return new Promise(resolve => setTimeout(resolve, 101 - this.speed));
    }

    draw(comparingIndices = [], sortedIndices = [], pivotIndex = -1) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = this.canvas.width / this.array.length;

        for (let i = 0; i < this.array.length; i++) {
            let color = this.colors.default;

            if (sortedIndices.includes(i)) {
                color = this.colors.sorted;
            } else if (comparingIndices.includes(i)) {
                color = this.colors.comparing;
            } else if (i === pivotIndex) {
                color = this.colors.pivot;
            }

            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                i * barWidth,
                this.canvas.height - this.array[i],
                barWidth - 1,
                this.array[i]
            );
        }
    }

    async bubbleSort() {
        const n = this.array.length;
        const sortedIndices = [];

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                this.draw([j, j + 1], sortedIndices);
                await this.delay();

                if (this.array[j] > this.array[j + 1]) {
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.swaps++;
                }
            }
            sortedIndices.push(n - i - 1);
        }

        sortedIndices.length = 0;
        for (let i = 0; i < n; i++) sortedIndices.push(i);
        this.draw([], sortedIndices);
    }

    async insertionSort() {
        const sortedIndices = [];

        for (let i = 1; i < this.array.length; i++) {
            let key = this.array[i];
            let j = i - 1;

            while (j >= 0 && this.array[j] > key) {
                this.comparisons++;
                this.draw([j, j + 1], sortedIndices);
                await this.delay();

                this.array[j + 1] = this.array[j];
                this.swaps++;
                j--;
            }

            this.array[j + 1] = key;
            sortedIndices.push(i);
        }

        for (let i = 0; i < this.array.length; i++) sortedIndices.push(i);
        this.draw([], sortedIndices);
    }

    async selectionSort() {
        const n = this.array.length;
        const sortedIndices = [];

        for (let i = 0; i < n; i++) {
            let minIdx = i;

            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                this.draw([minIdx, j], sortedIndices);
                await this.delay();

                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                this.swaps++;
            }

            sortedIndices.push(i);
        }

        for (let i = 0; i < n; i++) sortedIndices.push(i);
        this.draw([], sortedIndices);
    }

    async mergeSort() {
        const sortedIndices = [];
        await this.mergeSortHelper(0, this.array.length - 1, sortedIndices);
        
        for (let i = 0; i < this.array.length; i++) sortedIndices.push(i);
        this.draw([], sortedIndices);
    }

    async mergeSortHelper(left, right, sortedIndices) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await this.mergeSortHelper(left, mid, sortedIndices);
            await this.mergeSortHelper(mid + 1, right, sortedIndices);
            await this.merge(left, mid, right, sortedIndices);
        }
    }

    async merge(left, mid, right, sortedIndices) {
        const leftArray = this.array.slice(left, mid + 1);
        const rightArray = this.array.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        while (i < leftArray.length && j < rightArray.length) {
            this.comparisons++;
            this.draw([left + i, mid + 1 + j], sortedIndices);
            await this.delay();

            if (leftArray[i] <= rightArray[j]) {
                this.array[k++] = leftArray[i++];
            } else {
                this.array[k++] = rightArray[j++];
            }
            this.swaps++;
        }

        while (i < leftArray.length) {
            this.array[k++] = leftArray[i++];
            this.swaps++;
        }

        while (j < rightArray.length) {
            this.array[k++] = rightArray[j++];
            this.swaps++;
        }
    }

    async quickSort() {
        const sortedIndices = [];
        await this.quickSortHelper(0, this.array.length - 1, sortedIndices);
        
        for (let i = 0; i < this.array.length; i++) sortedIndices.push(i);
        this.draw([], sortedIndices);
    }

    async quickSortHelper(low, high, sortedIndices) {
        if (low < high) {
            const pi = await this.partition(low, high, sortedIndices);
            await this.quickSortHelper(low, pi - 1, sortedIndices);
            await this.quickSortHelper(pi + 1, high, sortedIndices);
        }
    }

    async partition(low, high, sortedIndices) {
        const pivot = this.array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.comparisons++;
            this.draw([j, high], sortedIndices, high);
            await this.delay();

            if (this.array[j] < pivot) {
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.swaps++;
            }
        }

        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.swaps++;
        return i + 1;
    }

    async heapSort() {
        const n = this.array.length;
        const sortedIndices = [];

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(n, i, sortedIndices);
        }

        for (let i = n - 1; i > 0; i--) {
            [this.array[0], this.array[i]] = [this.array[i], this.array[0]];
            this.swaps++;
            sortedIndices.push(i);
            this.draw([], sortedIndices);
            await this.delay();
            await this.heapify(i, 0, sortedIndices);
        }

        for (let i = 0; i < n; i++) sortedIndices.push(i);
        this.draw([], sortedIndices);
    }

    async heapify(n, i, sortedIndices) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && this.array[left] > this.array[largest]) {
            largest = left;
        }

        if (right < n && this.array[right] > this.array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            this.comparisons++;
            this.draw([i, largest], sortedIndices);
            await this.delay();

            [this.array[i], this.array[largest]] = [this.array[largest], this.array[i]];
            this.swaps++;

            await this.heapify(n, largest, sortedIndices);
        }
    }
}

const visualizer = new SortingVisualizer('canvas');

document.getElementById('arraySize').addEventListener('input', (e) => {
    document.getElementById('sizeDisplay').textContent = e.target.value;
});

document.getElementById('speed').addEventListener('input', (e) => {
    visualizer.speed = parseInt(e.target.value);
    document.getElementById('speedDisplay').textContent = e.target.value;
});

document.getElementById('generateBtn').addEventListener('click', () => {
    const size = parseInt(document.getElementById('arraySize').value);
    visualizer.generateArray(size);
});

document.getElementById('startBtn').addEventListener('click', async () => {
    if (visualizer.sorting || visualizer.array.length === 0) return;

    visualizer.sorting = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('algorithm').disabled = true;

    visualizer.startTime = Date.now();

    const algorithm = document.getElementById('algorithm').value;

    try {
        switch (algorithm) {
            case 'bubble':
                await visualizer.bubbleSort();
                break;
            case 'insertion':
                await visualizer.insertionSort();
                break;
            case 'selection':
                await visualizer.selectionSort();
                break;
            case 'merge':
                await visualizer.mergeSort();
                break;
            case 'quick':
                await visualizer.quickSort();
                break;
            case 'heap':
                await visualizer.heapSort();
                break;
        }
    } catch (e) {
        console.error(e);
    }

    const elapsed = Date.now() - visualizer.startTime;
    document.getElementById('comparisons').textContent = visualizer.comparisons;
    document.getElementById('swaps').textContent = visualizer.swaps;
    document.getElementById('time').textContent = elapsed;

    visualizer.sorting = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('algorithm').disabled = false;
});

document.getElementById('resetBtn').addEventListener('click', () => {
    visualizer.array = [];
    visualizer.comparisons = 0;
    visualizer.swaps = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('time').textContent = '0';
    visualizer.draw();
});

window.addEventListener('resize', () => {
    visualizer.resizeCanvas();
    visualizer.draw();
});

visualizer.resizeCanvas();
visualizer.generateArray(50);
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 处理文件拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5E5';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 处理文件选择
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 处理质量滑块变化
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value + '%';
        if (currentFile) compressImage(currentFile);
    });

    // 处理文件
    function handleFile(file) {
        if (!file.type.match(/image\/(jpeg|png)/i)) {
            alert('请上传 PNG 或 JPG 格式的图片！');
            return;
        }

        currentFile = file;
        originalSize.textContent = formatFileSize(file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            compressImage(file);
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 保持宽高比
                const maxWidth = 1920;
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (maxWidth * height) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                
                // 绘制图片
                ctx.drawImage(img, 0, 0, width, height);
                
                // 压缩
                const compressedDataUrl = canvas.toDataURL(
                    file.type, 
                    quality.value / 100
                );
                
                // 显示压缩后的图片
                compressedImage.src = compressedDataUrl;
                
                // 计算压缩后的大小
                const compressedSize = Math.round(
                    (compressedDataUrl.length - compressedDataUrl.indexOf(',') - 1) * 0.75
                );
                document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
                
                // 设置下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `compressed_${file.name}`;
                    link.href = compressedDataUrl;
                    link.click();
                };
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 
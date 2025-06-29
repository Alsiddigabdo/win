// دالة رفع صورة واحدة
async function uploadSingleImage(file, endpoint = '/upload/single') {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        imageUrl: result.imageUrl,
        publicId: result.publicId
      };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// دالة رفع عدة صور
async function uploadMultipleImages(files, endpoint = '/upload/multiple') {
  try {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        images: result.images
      };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('خطأ في رفع الصور:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// دالة رفع صورة بروفايل
async function uploadAvatar(file) {
  return await uploadSingleImage(file, '/upload/avatar');
}

// دالة لإنشاء معاينة للصورة
function createImagePreview(file, containerId) {
  const reader = new FileReader();
  const container = document.getElementById(containerId);
  
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.maxWidth = '200px';
    img.style.maxHeight = '200px';
    img.style.margin = '10px';
    
    container.innerHTML = '';
    container.appendChild(img);
  };
  
  reader.readAsDataURL(file);
}

// دالة لرفع الصورة مع معاينة
async function uploadImageWithPreview(inputElement, previewContainerId, endpoint = '/upload/single') {
  const file = inputElement.files[0];
  if (!file) {
    alert('الرجاء اختيار صورة');
    return null;
  }

  // إنشاء معاينة
  if (previewContainerId) {
    createImagePreview(file, previewContainerId);
  }

  // رفع الصورة
  const result = await uploadSingleImage(file, endpoint);
  
  if (result.success) {
    console.log('تم رفع الصورة بنجاح:', result.imageUrl);
    return result;
  } else {
    alert('خطأ في رفع الصورة: ' + result.error);
    return null;
  }
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.CloudinaryUpload = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadAvatar,
  createImagePreview,
  uploadImageWithPreview
}; 
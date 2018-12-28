function viewImageModal(source, alt){
    $('#previewImage').attr('src', source);
    $('#imageCaption').html(alt);
    $('#imageModal').css('display', 'block');
}

function closeImageModal(){
    $('#imageModal').css('display', 'none');
    $('#previewImage').attr('src', undefined);
    $('#imageCaption').html(undefined);
}

function viewVideoModal(source, alt){
    $('#previewVideo').attr('src', source);
    $('#videoCaption').html(alt);
    $('#videoModal').css('display', 'block');
}

function closeVideoModal(){
    $('#previewVideo').attr('src', undefined);
    $('#videoCaption').html(undefined);
    $('#videoModal').css('display', 'none');
}
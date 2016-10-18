$(document).ready(function() {

    $('.open-modal').on('click', function() {
        $('.modal').show();
        setTimeout(function(){
            $('.modal').addClass('active');
            $('#modal__form-container').addClass('active');
        }, 100);
    });

    $('.modal-container').on('click', function(e) {
        if (e.target === this){
            closeModal();
        }
    });

    $('.modal__close').on('click', function() {
        closeModal(); 
    });

    $('#view-1__form').submit(function(e){
        saveEmail(e.target.email, function() {
            $('.modal').show();

            setTimeout(function(){
                $('.modal').addClass('active');
                $('#modal__response-container').addClass('active');
            }, 100);
        });

        e.preventDefault();
    });

    $('#form-modal').submit(function(e){
        saveEmail(e.target.email, function() {
            $('#modal__form-container').removeClass('active');
            $('#modal__response-container').addClass('active');
        });

        e.preventDefault();
    });

    function saveEmail(emailElem, callback) {
        if (isValidEmail(emailElem)) {
            $.ajax({
                method: 'POST',
                data: { 'email': emailElem.value },
                url: 'http://liferay.io/wedeploy/emails'
            }).done(callback);
        }
    }

    function isValidEmail(emailElem) {
        var isValid = false;
        var emailInput = $(emailElem);
        var emailFeedback = emailInput.parent().next();

        if (emailInput.val() === '') {
            emailInput.addClass('error');
            emailFeedback.addClass('active');
            emailFeedback.text('*Please enter an email address.');
        } else {
            if (!emailHasAt(emailInput.val())) {
                emailInput.addClass('error');
                emailFeedback.addClass('active');
                emailFeedback.text('*Please enter a full email address, including the ‘@’..');
            } else {
                if (!emailHasDomain(emailInput.val())) {
                    emailInput.addClass('error');
                    emailFeedback.addClass('active');

                    var _email = emailInput.val();
                    var _split = _email.split('@');
                    var _domain = _split[1];

                    if(_domain == "") {
                        emailFeedback.text('*Do not forget the part after the @.');
                    } else {
                        emailFeedback.text('*This email address contain an invalid domain name \'' + _domain + '\'');
                    }
                } else {
                    emailInput.val('');
                    emailInput.removeClass('error');
                    emailFeedback.removeClass('active');
                    emailFeedback.text('');

                    isValid = true;
                }
            }
        }

        return isValid;
    }

    function emailHasAt(emailAddress) {
        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@/i);
        return pattern.test(emailAddress);
    }

    function emailHasDomain(emailAddress) {
        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
        return pattern.test(emailAddress);
    }

    function closeModal() {
        $('.modal').removeClass('active');
        $('.modal').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            $('.modal').hide();
            $('.modal').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

            //clear containers
            $('#modal__form-container').removeClass('active');
            $('#modal__response-container').removeClass('active');

            //clear form validation
            $('#form-modal__email').removeClass('error');
            $('#form-modal__validation').removeClass('active');
            $('#form-modal__validation').text('');
        });
    }
});
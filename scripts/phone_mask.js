document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('.phone-mask');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue += '(' + value.substring(0, 2);
                if (value.length > 2) {
                    formattedValue += ') ' + value.substring(2, 7);
                    if (value.length > 7) {
                        formattedValue += '-' + value.substring(7, 11);
                    }
                }
            }

            e.target.value = formattedValue;
        });
    });
});
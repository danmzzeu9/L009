document.addEventListener('DOMContentLoaded', () => {
    const generatorTypeSelect = document.getElementById('generator-type');
    const generatorValueInput = document.getElementById('generator-value');
    const generatorLocationInput = document.getElementById('generator-location');
    const generatorContactInput = document.getElementById('generator-contact');
    const generatorInfoTextarea = document.getElementById('generator-info');
    const infoCharCountSpan = document.querySelector('.card span');
    const generateButton = document.getElementById('generate-button');
    const whatsappShareButton = document.getElementById('whatsapp-share-button');

    const adImageContainer = document.querySelector('.image-generator .image');
    const adTitle = document.getElementById('ad-title');
    const adValue = document.getElementById('ad-value');
    const adLocation = document.getElementById('ad-location');
    const adInfo = document.getElementById('ad-info');
    const adContact = document.getElementById('ad-contact');

    let generatedImageBlob = null;

    const backgroundImages = {
        apartment: 'images/apartment.jpg',
        house: 'images/house.jpg',
        leisure: 'images/leisure.webp'
    };

    function updateAdContent() {
        const type = generatorTypeSelect.value;
        const value = generatorValueInput.value;
        const location = generatorLocationInput.value;
        const info = generatorInfoTextarea.value;
        const contact = generatorContactInput.value;

        let titleText = '';
        switch (type) {
            case 'apartment':
                titleText = 'Compro Apartamento';
                break;
            case 'house':
                titleText = 'Compro Casa';
                break;
            case 'leisure':
                titleText = 'Compro Área de Lazer';
                break;
            default:
                titleText = 'Compro Imóvel';
        }
        adTitle.textContent = titleText;

        adValue.innerHTML = value ? `<span>Valor:</span> ${value}` : '<span>Valor:</span> A combinar';
        adLocation.innerHTML = location ? `<span>Localização:</span> ${location}` : '<span>Localização:</span> Não informada';
        adInfo.innerHTML = info ? `<span>Informações adicionais:</span> ${info}` : '<span>Informações adicionais:</span> Nenhuma.';
        adContact.innerHTML = contact ? `<span>Contato:</span> ${contact}` : '<span>Contato:</span> Não informado';

        if (backgroundImages[type]) {
            adImageContainer.style.backgroundImage = `url('${backgroundImages[type]}')`;
            adImageContainer.style.backgroundSize = 'cover';
            adImageContainer.style.backgroundPosition = 'center';
            adImageContainer.style.backgroundRepeat = 'no-repeat';
        } else {
            adImageContainer.style.backgroundImage = 'none';
        }
    }

    function updateCharCount() {
        const currentLength = generatorInfoTextarea.value.length;
        const maxLength = generatorInfoTextarea.maxLength;
        infoCharCountSpan.textContent = `${currentLength} / ${maxLength}`;
    }

    generatorTypeSelect.addEventListener('change', updateAdContent);
    generatorValueInput.addEventListener('input', updateAdContent);
    generatorLocationInput.addEventListener('input', updateAdContent);
    generatorContactInput.addEventListener('input', updateAdContent);
    generatorInfoTextarea.addEventListener('input', () => {
        updateAdContent();
        updateCharCount();
    });

    generateButton.addEventListener('click', () => {
        const targetWidth = 1000;
        const targetHeight = 1000;

        const currentWidth = adImageContainer.offsetWidth;
        const currentHeight = adImageContainer.offsetHeight;

        const scale = Math.max(targetWidth / currentWidth, targetHeight / currentHeight);

        html2canvas(adImageContainer, {
            useCORS: true,
            scale: scale,
            width: targetWidth,
            height: targetHeight
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'anuncio-imovel.png';
            link.href = canvas.toDataURL('image/png');

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            canvas.toBlob(function(blob) {
                generatedImageBlob = blob;
                whatsappShareButton.style.display = 'block';
            }, 'image/png');

        }).catch(error => {
            console.error('Erro ao gerar a imagem:', error);
            alert('Não foi possível gerar a imagem. Verifique o console para detalhes.');
        });
    });

    whatsappShareButton.addEventListener('click', () => {
        const contactNumber = generatorContactInput.value.replace(/\D/g, '');

        let whatsappMessage = `Confira este imóvel:\n\n`;
        whatsappMessage += `Tipo: ${adTitle.textContent.replace('Compro ', '')}\n`;
        whatsappMessage += `${adValue.textContent}\n`;
        whatsappMessage += `${adLocation.textContent}\n`;
        if (adInfo.textContent && adInfo.textContent !== 'Nenhuma informação adicional.') {
            whatsappMessage += `Informações Adicionais: ${generatorInfoTextarea.value}\n`;
        }
        whatsappMessage += `${adContact.textContent}`;

        const encodedMessage = encodeURIComponent(whatsappMessage);

        let whatsappLink = `https://api.whatsapp.com/send?text=${encodedMessage}`;
        if (contactNumber) {
            whatsappLink = `https://api.whatsapp.com/send?phone=${contactNumber}&text=${encodedMessage}`;
        }

        if (navigator.share && generatedImageBlob) {
            const filesArray = [new File([generatedImageBlob], 'anuncio-imovel.png', { type: 'image/png' })];
            navigator.share({
                title: 'Anúncio de Imóvel',
                text: whatsappMessage,
                files: filesArray
            }).then(() => {
                console.log('Conteúdo compartilhado com sucesso!');
            }).catch((error) => {
                console.error('Erro ao compartilhar via Web Share API, abrindo WhatsApp link:', error);
                window.open(whatsappLink, '_blank');
            });
        } else {
            window.open(whatsappLink, '_blank');
        }
    });

    updateAdContent();
    updateCharCount();
});
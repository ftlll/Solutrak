import {ValidationRenderer, RenderInstruction, ValidateResult} from 'aurelia-validation';


export class BootstrapFormRenderer {
  render(instruction) {
    for (let {result, elements} of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let {result, elements} of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element, result) {
    if (result.valid) {
      return;
    }

    var closeElements = $(element).closest('.form-group');
    const formGroup = closeElements.length > 0 ? closeElements[0]:null;
    if (!formGroup) {
        return;
    }

        // add the has-error class to the enclosing form-group div
        formGroup.classList.add('has-error');

        var errorsAlreadyAdded = $(formGroup).find('.validation-wrapper');
        if (errorsAlreadyAdded !== null && errorsAlreadyAdded.length > 0)
            errorsAlreadyAdded.remove();

        // add help-block
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'validation-wrapper col-sm-12';
        messageWrapper.id = 'validation-wrapper-${result.id}';
        const message = document.createElement('span');
        message.className = 'help-block validation-message';
        message.textContent = result.message;
        message.id = 'validation-message-${result.id}';

        messageWrapper.appendChild(message);
        formGroup.appendChild(messageWrapper);
    }

    remove(element, result) {
        if (result.valid) {
            return;
        }

        var closeElements = $(element).closest('.form-group');
        const formGroup = closeElements.length > 0 ? closeElements[0] : null;
        if (!formGroup) {
            return;
        }

        // remove help-block
        const messageWrapper = formGroup.querySelector(`#validation-wrapper-${result.id}`);
        if (messageWrapper) {
            formGroup.removeChild(messageWrapper);

            // remove the has-error class from the enclosing form-group div
            if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
                formGroup.classList.remove('has-error');
            }
        }
    }
}

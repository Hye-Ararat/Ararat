(function(NioApp, $){
    'use strict';

    let dualListbox = new DualListbox('#basic-listbox');
    let preselectedListbox = new DualListbox('#preselected-listbox');
    let nosearchListbox = new DualListbox('#nosearch-listbox');
    nosearchListbox.search.classList.add('dual-listbox__search--hidden');

    let customLabelsListbox = new DualListbox('#custom-labels-listbox', {
        availableTitle: 'Source Options',
        selectedTitle: 'Destination Options',
        addButtonText: '<em class="icon ni ni-chevron-right"></em>',
        removeButtonText: '<em class="icon ni ni-chevron-left"></em>',
        addAllButtonText: '<em class="icon ni ni-chevrons-right"></em>',
        removeAllButtonText: '<em class="icon ni ni-chevrons-left"></em>'
    });

})(NioApp, jQuery);
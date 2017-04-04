export const showLoading = function(store) {
    store.dispatch('LOADING', {
        show: true
    })
}
export const hideLoading = function(store) {
    store.dispatch('LOADING', {
        show: false
    })
}
export const showError = function(store) {
    store.dispatch('ERROR', {
        error: true
    })
}
export const hideError = function(store) {
    store.dispatch('ERROR', {
        error: false
    })
}
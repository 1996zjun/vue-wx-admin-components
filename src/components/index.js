import multipleMediaUpload from './multipleMediaUpload/multipleMediaUpload'
import mutipleImageUpload from './mutipleImageUpload/mutipleImageUpload'
const components = [multipleMediaUpload, mutipleImageUpload]

const install = function(Vue) {
    if (install.installed) return
    install.installed = true

    components.map(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    ...components
}
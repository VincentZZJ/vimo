/**
 * 说明:
 * platform.js中关于平台方法的复写
 * 当前处于平台初始化完毕阶段, window.AlipayJSBridge等私有变量存在且可用
 * */
import { isArray, isFunction, isNumber, isPresent, isString } from '../util/util'
import Vue from 'vue'

export default function (plt) {
  window.dd.ui.webViewBounce.disable()

  // 获取网络环境
  window.dd.device.connection.getNetworkType({
    onSuccess (data) {
      // { result: 'wifi' // result值: wifi 2g 3g 4g unknown none   none表示离线 }
      plt.setNetworkType(data.result.toString().toLowerCase())
    }
  })

  // 注册平台 setTitle 方法, 参数在platform.js中
  plt.setNavbarTitle = (titleInfo) => {
    window.dd.biz.navigation.setTitle({
      title: titleInfo.title || '' // 控制标题文本，空字符串表示显示默认文本
    })
  }

  // title 点击事件
  document.addEventListener('navTitle', function () {
    Vue.prototype.$eventBus && Vue.prototype.$eventBus.$emit('onTitleClick')
  })

  // actionSheet
  plt.actionSheet = (options) => {
    if (isPresent(options) && isPresent(options.buttons) && isArray(options.buttons) && options.buttons.length < 9) {
      console.info('ActionSheet 组件使用DingTalk模式!')
      let buttons = []
      let cancelButton = {
        text: '取消',
        role: 'cancel',
        handler: () => {}
      }
      // let destructiveButtonIndex = -1
      for (let i = 0; options.buttons.length > i; i++) {
        if (options.buttons[i].role === 'cancel') {
          cancelButton = options.buttons[i]
          options.buttons.splice(i, 1)
          i--
        } else if (options.buttons[i].role === 'destructive') {
          // destructiveButtonIndex = i
          buttons.push(options.buttons[i].text)
        } else {
          buttons.push(options.buttons[i].text)
        }
      }
      options.buttons.push(cancelButton)
      window.dd.device.notification.actionSheet({
        title: options.title || '',
        cancelButton: cancelButton.text || '取消',
        otherButtons: buttons || [],
        onSuccess (result) {
          // onSuccess将在点击button之后回调
          // {buttonIndex: 0 //被点击按钮的索引值，Number，从0开始, 取消按钮为-1 }
          if (result.buttonIndex !== -1) {
            isPresent(options.buttons[result.buttonIndex]) && isFunction(options.buttons[result.buttonIndex].handler) && options.buttons[result.buttonIndex].handler()
          } else {
            isFunction(cancelButton.handler) && cancelButton.handler()
          }
        }
      })
      return true
    }
    return false
  }

  // alert
  plt.alert = (options) => {
    // modal
    if (options.image) {
      console.info('modal 组件使用DingTalk模式!')
      let cancelButton = {}
      let confirmButton = {}
      options.buttons.forEach((button) => {
        if (button.role === 'cancel') {
          cancelButton = button
        } else {
          confirmButton = button
        }
      })

      window.dd.device.notification.modal({
        image: options.image,
        title: options.title || '',
        content: options.message || '',
        buttonLabels: [cancelButton.text || '取消', confirmButton.text || '确定'],
        onSuccess (result) {
          // {buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始}
          if (result.buttonIndex === 0) {
            isFunction(cancelButton.handler) && cancelButton.handler()
          } else {
            isFunction(confirmButton.handler) && confirmButton.handler()
          }
        }
      })

      return true
    }

    // alert 模式
    if (options.buttons.length === 1) {
      console.debug('Alert 组件使用DingTalk模式!')
      window.dd.device.notification.alert({
        title: options.title || '',
        message: options.message || '',
        buttonName: options.buttons[0].text || '确定',
        onSuccess () {
          isPresent(options.buttons[0]) && isFunction(options.buttons[0].handler) && options.buttons[0].handler()
        }
      })
      return true
    }

    // Confirm
    if (options.buttons.length === 2 && !options.inputs) {
      console.debug('Confirm 组件使用DingTalk模式!')
      let cancelButton = {}
      let confirmButton = {}
      options.buttons.forEach((button) => {
        if (button.role === 'cancel') {
          cancelButton = button
        } else {
          confirmButton = button
        }
      })
      window.dd.device.notification.confirm({
        message: options.message || '',
        title: options.title || '',
        buttonLabels: [cancelButton.text || '取消', confirmButton.text || '确定'],
        onSuccess (result) {
          // onSuccess将在点击button之后回调
          // {buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始}
          if (result.buttonIndex === 0) {
            isFunction(cancelButton.handler) && cancelButton.handler()
          } else {
            isFunction(confirmButton.handler) && confirmButton.handler()
          }
        }
      })
      return true
    }

    // prompt 模式
    if (options.buttons.length === 2 && options.inputs && options.inputs.length === 1 && (options.inputs[0].type !== 'radio' || options.inputs[0].type !== 'checkbox')) {
      console.info('Prompt 组件使用DingTalk模式!')
      let cancelButton = {}
      let confirmButton = {}
      options.buttons.forEach((button) => {
        if (button.role === 'cancel') {
          cancelButton = button
        } else {
          confirmButton = button
        }
      })
      window.dd.device.notification.prompt({
        title: options.title || '',
        message: options.message || '',
        buttonLabels: [cancelButton.text || '取消', confirmButton.text || '确定'],
        onSuccess (result) {
          // onSuccess将在点击button之后回调
          // {buttonIndex: 0, value: ''}
          if (result.buttonIndex === 0) {
            isFunction(cancelButton.handler) && cancelButton.handler({[options.inputs[0].name]: result.value})
          } else {
            isFunction(confirmButton.handler) && confirmButton.handler({[options.inputs[0].name]: result.value})
          }
        }
      })
      return true
    }

    return false
  }

  // showLoading
  plt.showLoading = (options) => {
    console.debug('Loading:showLoading 组件使用DingTalk模式!')
    window.dd.device.notification.showPreloader({
      text: options.content || '',
      showIcon: true // 是否显示icon，默认true
    })
    return true
  }

  // hideLoading
  plt.hideLoading = () => {
    console.debug('Loading:hideLoading 组件使用DingTalk模式!')
    window.dd.device.notification.hidePreloader()
    return true
  }

  // showToast
  plt.showToast = (options) => {
    console.debug('Toast 组件使用DingTalk模式!')
    if (options.type === 'fail') { options.type = 'error' }
    window.dd.device.notification.toast({
      icon: options.type || '', // icon样式，有success和error，默认为空 0.0.2
      text: options.message || '', // 提示信息
      duration: options.duration / 1000 || 2, // 显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
      delay: options.delay || 0, // 延迟显示，单位秒，默认0
      onSuccess () {
        isFunction(options.onDismiss) && options.onDismiss()
      }
    })
    return true
  }

  // hideToast
  plt.hideToast = () => {
    return false
  }

  plt.picker = (options) => {
    if (options.columns.length === 1) {
      /**
       * normalize the data
       * */
      options.buttons = options.buttons.map(button => {
        if (isString(button)) {
          return {text: button}
        }
        if (button.role) {
          // role: cancel / button
          button.cssRole = `picker-toolbar-${button.role}`
        }
        return button
      })

      /**
       * clean up dat data
       * */
      options.columns = options.columns.map(column => {
        if (!isPresent(column.options)) {
          column.options = []
        }
        column.selectedIndex = Math.max(0, parseInt(column.selectedIndex))
        column.options = column.options.map(inputOpt => {
          // PickerColumnOption
          let opt = {
            text: '',
            value: '',
            disabled: inputOpt.disabled || false
          }

          if (isPresent(inputOpt)) {
            if (isString(inputOpt) || isNumber(inputOpt)) {
              opt.text = inputOpt.toString()
              opt.value = inputOpt
            } else {
              opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value
              opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text
            }
          }
          return opt
        })
        return column
      })

      let buttons = options.buttons
      let cancelBtn
      let confirmBtn
      if (buttons[0].role === 'cancel') {
        cancelBtn = buttons[0]
        confirmBtn = buttons[1]
      } else {
        cancelBtn = buttons[1]
        confirmBtn = buttons[0]
      }

      let columns = options.columns || []
      let column = columns[0]
      let columnOptions = column.options || []
      let selectedIndex = Math.max(0, column.selectedIndex)
      let selectedKey = columnOptions[selectedIndex].value
      let source = columnOptions.map((item) => {
        if (!item.disabled) {
          return {
            key: item.text,
            value: item.value
          }
        }
      })

      window.dd.biz.util.chosen({
        source: source,
        selectedKey: selectedKey, // 默认选中的key
        onSuccess (result) {
          let data = {}
          if (result) {
            data[column.name] = {
              'text': result.key,
              'value': result.value,
              'columnIndex': 0
            }
            isFunction(confirmBtn.handler) && confirmBtn.handler(data)
          } else {
            // 取消
            isFunction(cancelBtn.handler) && cancelBtn.handler(data)
          }
        },
        onFail (err) {}
      })
      return true
    }
    return false
  }

  plt.previewImage = (options) => {
    console.debug('PreviewImage 组件使用 Dingtalk 模式!')
    window.dd.biz.util.previewImage({
      current: options.urls[options.current] || '',
      urls: options.urls
    })
    return true
  }

  plt.pushWindow = (url) => {
    window.dd.biz.util.openLink({
      url: url, // 要打开链接的地址
      onFail (err) {
        console.error(`history.js _pushHistory(): ${JSON.stringify(err)}`)
      }
    })
    return true
  }

  plt.popWindow = () => {
    window.dd.biz.navigation.close()
    return true
  }

  plt.popTo = () => {
    return false
  }
}
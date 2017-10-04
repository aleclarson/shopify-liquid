const lexical = require('./lexical')
const Syntax = require('./syntax')

var valueRE = new RegExp(`${lexical.value.source}`, 'g')

module.exports = function (options) {
  options = Object.assign({}, options)
  var filters = {}

  var _filterInstance = {
    render: function (output, scope) {
      var args = this.args.map(arg => Syntax.evalValue(arg, scope))
      args.unshift(output)
      return this.filter.apply(scope, args)
    },
    parse: function (str) {
      var match = lexical.filterLine.exec(str)
      if (!match) throw Error('illegal filter: ' + str)

      var name = match[1]
      var argList = match[2] || ''
      var filter = filters[name]
      if (typeof filter !== 'function') {
        if (options.strict_filters) {
          throw TypeError(`undefined filter: ${name}`)
        }
        this.name = name
        this.filter = x => x
        this.args = []
        return this
      }

      var args = []
      while ((match = valueRE.exec(argList.trim()))) {
        var v = match[0]
        var re = new RegExp(`${v}\\s*:`, 'g')
        re.test(match.input) ? args.push(`'${v}'`) : args.push(v)
      }

      this.name = name
      this.filter = filter
      this.args = args

      return this
    }
  }

  function construct (str) {
    var instance = Object.create(_filterInstance)
    return instance.parse(str)
  }

  function register (name, filter) {
    filters[name] = filter
  }

  function clear () {
    filters = {}
  }

  return {
    construct, register, clear
  }
}

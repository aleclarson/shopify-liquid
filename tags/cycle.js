const Liquid = require('..');
const lexical = Liquid.lexical;
const groupRE = new RegExp(`^(?:(${lexical.value.source})\\s*:\\s*)?(.*)$`);
const candidatesRE = new RegExp(lexical.value.source, 'g');

module.exports = function(liquid) {
    liquid.registerTag('cycle', {

        parse: function(tagToken, remainTokens) {
            var match = groupRE.exec(tagToken.args);
            if (!match) throw Error(`illegal tag: ${tagToken.raw}`);

            this.group = match[1] || '';
            var candidates = match[2];

            this.candidates = [];

            while(match = candidatesRE.exec(candidates)){
                this.candidates.push(match[0]);
            }

            if (!this.candidates.length) {
              throw Error(`empty candidates: ${tagToken.raw}`);
            }
        },

        render: function(scope, hash) {
            var group = Liquid.evalValue(this.group, scope);
            var fingerprint = `cycle:${group}:` + this.candidates.join(',');
            var register = scope.get('liquid');
            var idx = register[fingerprint];

            if(idx === undefined){
                idx = register[fingerprint] = 0;
            }

            var candidate = this.candidates[idx];
            idx = (idx + 1) % this.candidates.length;
            register[fingerprint] = idx;

            return Promise.resolve(Liquid.evalValue(candidate, scope));
        }
    });
};

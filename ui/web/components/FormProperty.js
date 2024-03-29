Vue.component('FormProperty', {
    props: {
        p: {
            type: Object, default: () => {
                return {
                    name: '',
                    type: '',
                    ref: '',
                    refDisplayField: '',
                    label: '',
                    icon: '',
                    required: false,
                    search: false,
                    i18n: {en: '', es: '', pt: ''}
                }
            }
        }
    },
    created() {
        console.log(this.p)
    },
    data() {
        return {
            options: ['String', 'StringLarge','StringList','Int', 'Float', 'Date', 'Datetime', 'Boolean', 'ObjectId', 'ObjectIdRel', 'ObjectIdList', 'Enum', 'EnumList', 'Mixed', 'MultiLang'],
            errors: [],
            form: {
                name: this.p.name ? this.p.name : '',
                type: this.p.type ? this.p.type : '',
                ref: this.p.ref ? this.p.ref : '',
                refDisplayField: this.p.refDisplayField ? this.p.refDisplayField : '',
                enumOptions: this.p.enumOptions ? this.p.enumOptions : '',
                label: this.p.label ? this.p.label : '',
                icon: this.p.icon ? this.p.icon : '',
                required: this.p.required ? this.p.required : false,
                disabled: this.p.disabled ? this.p.disabled : false,
                unique: this.p.unique ? this.p.unique : false,
                default: this.p.default ? this.p.default : '',
                search: this.p.search ? this.p.search : false,
                i18n: {
                    en: this.p.i18n ? this.p.i18n.en : '',
                    es: this.p.i18n ? this.p.i18n.es : '',
                    pt: this.p.i18n ? this.p.i18n.pt : ''
                }

            }
        }
    },
    watch: {
        p: {
            deep: true,
            handler: function (val) {
                this.form = Object.assign({}, val)
                this.$set(this.form, 'i18n', Object.assign({}, val.i18n))
                this.$nextTick()
            }
        }
    },
    methods: {
        apply() {
            let error = false

            //Check name required
            if (this.form.name.length == 0) {
                this.errors.push('name')
                error = true
            } else {
                let index = this.errors.indexOf('name');
                if (index !== -1) this.errors.splice(index, 1);
            }

            //Check type required
            if (this.form.type.length == 0) {
                error = true
                this.errors.push('type')
            } else {
                let index = this.errors.indexOf('type');
                if (index !== -1) this.errors.splice(index, 1);
            }

            //Check ref required
            if ((this.form.type == 'ObjectId' || this.form.type == 'ObjectIdList') && this.form.ref.length == 0) {
                error = true
                this.errors.push('ref')
            } else {
                let index = this.errors.indexOf('ref');
                if (index !== -1) this.errors.splice(index, 1);
            }

            if (!error) {
                let f = Object.assign({}, this.form)
                f.i18n = Object.assign({}, this.form.i18n)
                this.$emit('apply', f)
            } else {
                console.log('ERROR')
            }
        }
    },
    template: `<div class="row">

    <div class="col-12 py-1">
        <input-text label="Name" name="name" v-model="form.name" :errors="errors"></input-text>
    </div>
      

    <div class="col-12 py-1">
        <input-select :options="options" label="type" name="type" v-model="form.type" :errors="errors"></input-select>
    </div>
    
    <div class="col-12 py-1" v-if="form.type =='ObjectId' || form.type =='ObjectIdRel' || form.type =='ObjectIdList'">
        <input-text  label="Ref" name="ref" v-model="form.ref" :errors="errors"></input-text>
    </div>
    
      <div class="col-12 py-1" v-if="form.type =='ObjectId' || form.type =='ObjectIdRel' || form.type =='ObjectIdList'">
        <input-text  label="RefDisplayField" name="refDisplayField" v-model="form.refDisplayField" :errors="errors"></input-text>
    </div>
    
      <div class="col-12 py-1" v-if="form.type =='Enum' || form.type =='EnumList'">
        <input-text  label="Enum Options" name="enumOptions" v-model="form.enumOptions" :errors="errors"></input-text>
    </div>
    
    <div class="col-12 py-1">
        <input-text label="Default" name="default" v-model="form.default" :errors="errors"></input-text>
    </div>
    
    <div class="col-12 py-1">
                     <input-text label="Icon" name="icon" v-model="form.icon" :errors="errors"></input-text>
    </div>
    
    <div class="col-12 py-0">
        <div class="row">
          <div class="col-6 py-1">
                  <input-checkbox label="Disabled" name="disabled" v-model="form.disabled" :errors="errors"></input-checkbox>

          </div>
          <div class="col-6 py-1">
                  <input-checkbox label="Required" name="required" v-model="form.required" :errors="errors"></input-checkbox>
          </div>
        </div>
    </div>
    
   <div class="col-12 py-0">
        <div class="row">
          <div class="col-6 py-1">
               <input-checkbox label="Search" name="search" v-model="form.search" :errors="errors"></input-checkbox>
          </div>
          <div class="col-6 py-1">
               <input-checkbox label="Unique" name="unique" v-model="form.unique" :errors="errors"></input-checkbox>
          </div>
        </div>
    </div>
    
    
    
    <div class="col-12 py-1">
     <input-text label="en" name="en" v-model="form.i18n.en" :errors="errors"></input-text>
    </div>
    
    <div class="col-12 py-1">
    <input-text label="es" name="es" v-model="form.i18n.es" :errors="errors"></input-text>
    </div>
    
    <div class="col-12 py-1">
    <input-text label="pt" name="pt" v-model="form.i18n.pt" :errors="errors"></input-text>
    </div>
    
     <div class="col-12 py-1" >
        <button class="btn btn-outline-success" @click="apply">Apply</button>
        <button class="btn btn-primary float-right" @click="$emit('new')">New</button>
     </div>
</div>`
})

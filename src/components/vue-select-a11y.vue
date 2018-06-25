<template>
    <div class="multi-select" role="combobox" tabIndex="0" aria-haspopup="true"
         v-bind:area-expanded=showList
         v-on:keyup.enter="toggleShow"
         v-on:keyup.esc="closeList"
         v-on:keyup.up="previousItem"
         v-on:keyup.down="nextItem"
         v-on:keyup.space="toggleItem"
    >
        <span v-on:click="toggleShow">
            <label>{{ selectSummary }}</label>
            <span class="chevron" aria-hidden="true">^</span>
        </span>
        <div v-if="showList">
            <ul
            >
                <li
                    v-bind:class=itemClass(-1)
                    v-bind:aria-checked=allItemsChecked
                    v-bind:aria-selected=hasFocus(-1)
                >
                    <label>
                        <input type="checkbox"
                               v-bind:name=inputName
                               v-bind:checked=allIsChecked
                               v-bind:tabindex=tabIndex(-1)
                               v-bind:id=getItemId(-1)
                               v-on:click=toggleAll()
                        />
                        (All)
                    </label>
                </li>
                <li v-for="(item, index) in items"
                    v-bind:key="item.key"
                    v-bind:class="itemClass(index)"
                    v-bind:aria-checked="isChecked(item.key)"
                    v-bind:aria-selected="hasFocus(index)"
                >
                    <label>
                        <input type="checkbox"
                               v-model="checkedItems"
                               v-bind:name=inputName
                               v-bind:value=item.key
                               v-bind:tabindex=tabIndex(index)
                               v-bind:id=getItemId(index)
                               v-on:click="updated(index)"
                        />
                        {{ item.value }}
                    </label>
                </li>
            </ul>
            <div class="multi-select-backdrop"></div>
        </div>

    </div>
</template>

<script>
export default {
  name: 'vue-select-a11y',
  props: {
    items: {
      type: Array,
      required: true
    },
    inputName: {
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  created () {
    this.checkedItems = this.value
    this.baseId = `vsa11y-${Math.random().toString(36).substr(2, 5)}`
  },

  data: function () {
    return {
      allIsChecked: false,
      baseClass: '',
      focusedItem: -1,
      checkedItems: [],
      showList: false
    }
  },
  computed: {
    allItemsChecked () {
      return (this.checkedItems.length === this.items.length)
    },
    selectSummary () {
      return 'Select a value'
    }
  },
  methods: {
    closeList () {
      this.showList = false
    },

    hasFocus (index) {
      return this.focusedItem === index
    },

    getItemId (index) {
      return `${this.baseId}-${index}`
    },

    isChecked (key) {
      return this.checkedItems.indexOf(key) !== -1
    },

    itemClass (index) {
      return this.hasFocus(index) ? `focused` : ''
    },

    nextItem () {
      if (this.showList) {
        if (this.focusedItem < this.items.length - 1) {
          this.focusedItem++
        } else {
          this.focusedItem = -1
        }
        this.setFocus()
      } else {
        this.showList = true
      }
    },

    previousItem () {
      if (this.showList) {
        if (this.focusedItem > -1) {
          this.focusedItem--
        } else {
          this.focusedItem = this.items.length - 1
        }
        this.setFocus()
      }
    },

    setFocus () {
      document.getElementById(this.getItemId(this.focusedItem)).focus()
    },

    tabIndex (index) {
      return this.hasFocus(index) ? '0' : '-1'
    },

    toggleItem () {
      if (this.showList) {
        if (this.focusedItem !== -1) {
          const key = this.items[this.focusedItem].key
          const index = this.checkedItems.indexOf(key)
          if (index === -1) {
            this.checkedItems.push(key)
          } else {
            this.checkedItems.splice(index, 1)
          }
          this.allIsChecked = this.allItemsChecked
          this.$emit('changed', this.checkedItems)
        }
      } else {
        this.showList = true
      }
    },

    toggleShow () {
      this.showList = !this.showList
    },

    toggleAll () {
      if (this.allIsChecked) {
        this.checkedItems = []
      } else {
        this.checkedItems = this.items.map((option) => {
          return option.key
        })
      }
      this.allIsChecked = !this.allIsChecked
      this.$emit('changed', this.checkedItems)
    },

    updated (index) {
      this.focusedItem = index
      this.$nextTick(() => {
        this.allIsChecked = this.allItemsChecked
        this.$emit('changed', this.checkedItems)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-select, .multi-select-plugin {
    display: inline-block;
    position: relative;
    text-align: left;

    > span {
        border: none;
        background: none;
        position: relative;
        padding: .25em .5em;
        padding-right: 1.5em;
        display: block;
        border: solid 1px #000;
        cursor: pointer;

        > .chevron {
            display: inline-block;
            transform: rotate(-180deg) scale(1.5, 1) translate(-50%, 0);
            font-weight: bold;
            font-size: .75em;
            position: absolute;
            top: .5em;
            right: 1em;
        }
    }

    > div {
        > ul {
            position: absolute;
            list-style: none;
            padding: 0;
            margin: 0;
            left: 0;
            top: 100%;
            min-width: 100%;
            z-index: 1000;
            background: #fff;
            border: 1px solid rgba(0, 0, 0, .15);
            box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
            display: block;
            max-height: 320px;
            overflow-x: hidden;
            overflow-y: auto;

            > li {
                white-space: nowrap;

                &.selected {
                    > label {
                        background-color: LightBlue;
                    }
                }

                &.focused {
                    > label {
                        background-color: DodgerBlue;
                    }
                }

                > label {
                    padding: .25em .5em;
                    display: block;

                    &:focus, &:hover {
                        background-color: DodgerBlue;
                    }
                }
            }
        }

        &-backdrop {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 900;
        }
    }
}
</style>

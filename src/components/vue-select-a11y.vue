<template>
    <div class="multi-select" role="combobox" tabIndex="0">
        <span v-on:click="toggleShow">
            <label>Select a value</label>
            <span class="chevron">^</span>
        </span>
        <div v-if="showList">
            <ul>
                <li>
                    <label>
                        <input type="checkbox" :name=inputName v-on:click="toggleAll" :checked=allSelected />
                        (All)
                    </label>
                </li>
                <li v-for="(item) in items"
                    v-bind:key="item.key"
                >
                    <label>
                        <input type="checkbox"
                               :name=inputName
                               :value=item.key
                               v-model="selectedItems"
                               v-on:click="updated"
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
    this.selectedItems = this.value
  },

  data: function () {
    return {
      allSelected: false,
      selectedItems: [],
      showList: false
    }
  },
  computed: {
  },
  methods: {
    toggleShow () {
      this.showList = !this.showList
    },

    toggleAll () {
      console.log('All')
      this.allSelected = !this.allSelected
      if (this.allSelected) {
        this.selectedItems = this.items.map((option) => {
          return option.key
        })
      } else {
        this.selectedItems = []
      }
      this.$emit('changed', this.selectedItems)
    },

    updated () {
      this.$nextTick(() => this.$emit('changed', this.selectedItems))
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

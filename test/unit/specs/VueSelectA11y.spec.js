import { mount } from '@vue/test-utils'
import VueSelectA11y from '@/components/vue-select-a11y'

const languages = [
  { key: 'en', value: 'English' },
  { key: 'fr', value: 'French' },
  { key: 'pt', value: 'Portuguese' },
  { key: 'es', value: 'Spanish' },
  { key: 'ar', value: 'Arabic' }
]

const factory = (params) => {
  let props = {
    id: 'my-vue-select-a11y',
    inputName: 'languages',
    items: languages,
    value: []
  }

  Object.assign(props, params)

  return mount(VueSelectA11y, {
    propsData: props
  })
}

describe('vue-select-a11y.vue', () => {
  it('should render correct contents', () => {
    const wrapper = factory({value: ['en', 'fr']})
    expect(wrapper.find('button').text()).toContain('English,French')
  })

  it('should display list of selected options in the button text', () => {
    const wrapper = factory({value: ['en', 'fr', 'pt']})
    expect(wrapper.find('button').text()).toContain('English,French,Portuguese')
  })

  it('should display default summaryEmpty if no value selected', () => {
    const wrapper = factory({})
    expect(wrapper.find('button').text()).toContain('Select a value')
  })

  it('should display summaryEmpty if no value selected', () => {
    const wrapper = factory({summaryEmpty: 'Select a language'})
    expect(wrapper.find('button').text()).toContain('Select a language')
  })

  it('should display summary when values selected', () => {
    const wrapper = factory({
      summary: 'Selected {count} of {total}: {selectedList}',
      value: ['en', 'fr']
    })
    expect(wrapper.find('button').text()).toContain('Selected 2 of 5: English,French')
  })

  it('should set aria-label to default aria-summary when values selected', () => {
    const wrapper = factory({
      value: ['en', 'fr']
    })
    expect(wrapper.find('button').attributes()['aria-label']).toContain('Selected 2 of 5: English,French')
  })

  it('should set aria-label to aria-summary when values selected', () => {
    const wrapper = factory({
      ariaSummary: 'Selected {count} of {total} languages',
      value: ['en', 'fr']
    })
    expect(wrapper.find('button').attributes()['aria-label']).toContain('Selected 2 of 5 languages')
  })

  it('should set aria-label to default aria-summary-empty when no values selected', () => {
    const wrapper = factory()
    expect(wrapper.find('button').attributes()['aria-label']).toContain('None selected. Select a value')
  })

  it('should set aria-label to aria-summary-empty when no values selected', () => {
    const wrapper = factory({
      ariaSummaryEmpty: 'No languages selected. Select a language.'
    })
    expect(wrapper.find('button').attributes()['aria-label']).toContain('No languages selected. Select a language.')
  })

  it('should show list of options when button clicked', () => {
    const wrapper = factory({
      value: ['en', 'fr']
    })
    wrapper.find('button').trigger('click')
    const listContainer = wrapper.find('ul')
    expect(listContainer.isVisible()).toBe(true)
    // The list contains 'All' as an option in addition to languages
    expect(listContainer.findAll('li').length).toBe(languages.length + 1)
    expect(listContainer.findAll('input[type="checkbox"]').length).toBe(languages.length + 1)
    expect(listContainer.findAll('input[type="checkbox"]:checked').length).toBe(2)
  })

  it('should check all options when all is clicked/checked', () => {
    const wrapper = factory({
      value: ['en', 'fr']
    })
    wrapper.vm.$data.showList = true
    wrapper.find('input').trigger('click') // The first input found is all
    // The list contains 'All' as an option in addition to languages
    expect(wrapper.find('ul').findAll('input[type="checkbox"]:checked').length).toBe(languages.length + 1)
    expect(wrapper.find('button').attributes()['aria-label']).toContain('Selected 5 of 5: English,French,Portuguese,Spanish,Arabic')
  })

  it('should emit changed event when all is clicked/checked', () => {
    const wrapper = factory({
      value: ['en', 'fr']
    })
    wrapper.vm.$data.showList = true
    wrapper.find('input').trigger('click') // The first input found is all
    let changedEvent = wrapper.emitted().changed
    expect(changedEvent).toBeTruthy()
    expect(changedEvent[0][0].length).toBe(languages.length)
    expect(changedEvent[0][0]).toEqual(['en', 'fr', 'pt', 'es', 'ar'])
  })

  it('should uncheck all options when all is unchecked', () => {
    const wrapper = factory({
      value: ['en', 'fr']
    })
    wrapper.vm.$data.showList = true
    wrapper.find('input').trigger('click') // The first input found is all (check it)
    wrapper.find('input').trigger('click') // The first input found is all (uncheck it)
    expect(wrapper.find('ul').findAll('input[type="checkbox"]:checked').length).toBe(0)
    expect(wrapper.find('button').attributes()['aria-label']).toContain('None selected. Select a value')
    expect(wrapper.find('button').text()).toContain('Select a value')
  })

  it('should emit changed event when all is unchecked', () => {
    const wrapper = factory({
      value: ['en', 'fr', 'pt', 'es', 'ar']
    })
    wrapper.vm.$data.showList = true
    wrapper.find('input').trigger('click') // The first input found is all
    let changedEvent = wrapper.emitted().changed
    expect(changedEvent).toBeTruthy()
    expect(changedEvent[0][0].length).toBe(0)
    expect(changedEvent[0][0]).toEqual([])
  })

  it('should uncheck the all option if all are checked and then one item is unchecked', async () => {
    const wrapper = factory({
      value: ['en', 'fr', 'pt', 'es', 'ar']
    })
    wrapper.vm.$data.showList = true
    console.log(wrapper.find('ul > li:last-child').find('input'), wrapper.find('ul > li:last-child').find('input').element, wrapper.find('ul > li:last-child').find('input').element.checked, wrapper.vm.$data.checkedItems)
    wrapper.find('ul > li:last-child').find('input').setChecked(false)
    await wrapper.vm.$nextTick()
    console.log(wrapper.find('ul > li:last-child').find('input'), wrapper.find('ul > li:last-child').find('input').element, wrapper.find('ul > li:last-child').find('input').element.checked, wrapper.vm.$data.checkedItems)
    expect(wrapper.vm.$data.checkedItems.length).toBe(4)
    expect(wrapper.findAll('input[type="checkbox"]:checked').length).toBe(4) // I know this is wrong
  })
})

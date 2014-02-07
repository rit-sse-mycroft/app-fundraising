require 'srgs'
require 'json'

module FundraisingGrammar
  include Srgs::DSL

  extend self

  grammar 'fundraising' do
    private_rule 'items' do
      one_of do
        items = JSON.parse(File.open('./items.json').read)
        items.each do |item|
          item item['name']
          item['otherNames'].each do |name|
            item name
          end
        end
      end
    end

    private_rule 'fundraising' do
      item 'Mycroft how much'
      one_of do
        item 'does'
        item 'do'
        item 'is'
        item 'are'
      end
      item 'the', repeat: '0-1'
      reference 'items'
      tag 'out.item=rules.items;'
      item 'cost', repeat: '0-1'
    end
  end
end
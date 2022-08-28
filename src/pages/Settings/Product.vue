<template>
  <div>
    <pending-settings :has-unsaved-changes="hasUnsavedChanges" :saving="saving" @save="saveChanges"
      v-if="!onboarding" />
    <template v-if="current">
      <card v-if="!onboarding">
        <h3 slot="header">{{ $t("product recommendations") }}</h3>
        <p>{{ $t("turn each product section on/off") }}</p>

        <el-collapse accordion v-model="currentSection.context" @change="handleCurrentSectionChange('context', $event)">
          <el-collapse-item v-for="(settings, type) in current.context" :key="type" :name="type"
            :disabled="!productAccess[type]">
            <template v-if="productAccess[type]" #title>
              <span @click.stop @keyup.stop>
                <el-checkbox v-model="settings.active">{{
                    client.type == "shopify" &&
                      ["top", "user_related_categories"].includes(type)
                      ? $t(type + "_shopify")
                      : $t(type)
                }}</el-checkbox>
                <a v-if="userGuideLinks[languageCode][type]" class="user-guide-link" target="_blank"
                  :href="userGuideLinks[languageCode][type]">
                  <el-icon class="header-icon">
                    <info-filled />
                  </el-icon>
                  {{ $t("see in user guide") }}
                </a>
              </span>
              <span v-if="currentSection.context === type" class="collapse-item-reset" @click.stop @keyup.stop>
                <el-button @click="handleSectionReset('context', type)">{{
                    $t("reset")
                }}</el-button>
              </span>
            </template>
            <template v-else #title>
              <span @click.stop @keyup.stop>
                <span class="el-checkbox__label">
                  {{
                  client.type == "shopify" &&
                  ["top", "user_related_categories"].includes(type)
                  ? $t(type + "_shopify")
                  : $t(type)
                  }}
                </span>
                <router-link to="/billing" class="user-guide-link">
                  <i class="ti-unlock" />
                  {{ $t("upgrade plan") }}
                </router-link>
              </span>
            </template>

            <el-form :model="settings" size="small" label-position="top" :disabled="!settings.active">
              <el-form-item :label="$t('change title')" v-if="type != 'user_related_categories'">
                <el-input :placeholder="titlePlaceholders[language][type]" v-model="settings.title" />
              </el-form-item>

              <el-form-item :label="
                $t(
                  'show {sections} dynamic categories' +
                  (client.type == 'shopify' ? '_shopify' : ''),
                  { sections: settings.sections }
                )
              " v-else>
                <el-slider v-model="settings.sections" :show-tooltip="true" :min="1" :max="5" />
              </el-form-item>

              <el-form-item :label="$t('turn on/off at following pages')">
                <div class="page-switch-wrapper" v-for="(_, page) of settings.enabled" :key="page">
                  <el-switch v-model="settings.enabled[page]" active-color="#fdb809" :active-text="
                    client.type == 'shopify' && page == 'category'
                      ? $t(`page:category_shopify`)
                      : $t(`page:${page}`)
                  " />

                  <template v-if="pageCheckEnabled && pageStatus[page] !== 'found'">
                    <i18n-t keypath="we couldnt find the snippet" tag="p">
                      <template #guide>
                        <a :href="installGuideLink" target="_blank">{{
                            $t("install guide")
                        }}</a>
                      </template>
                    </i18n-t>

                    <el-button size="small" :loading="pageStatus[page] === 'checking'" @click="checkPageStatus(page)">{{
                        $t("refresh")
                    }}</el-button>
                  </template>
                </div>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </card>

      <card class="layout-picker" v-if="!onboarding">
        <h3 slot="header">{{ $t("product section type") }}</h3>
        <p>{{ $t("choose layout of your product section") }}</p>

        <el-radio-group class="row" v-model="current.section_layout">
          <div class="col-6">
            <el-radio label="grid">{{ $t("grid") }}</el-radio>
            <el-tag size="small" type="success">
              <i class="el-icon-star-on" />
              {{ $t("recommended") }}
            </el-tag>
            <img svg-inline src="@/assets/img/settings/layout-grid.svg" />
          </div>
          <div class="col-6">
            <el-radio label="slider">{{ $t("slider") }}</el-radio>
            <img svg-inline src="@/assets/img/settings/layout-carousel.svg" />
          </div>
        </el-radio-group>

        <hr />
        <p class="footnote">
          <i class="ti-info" />
          {{ $t("we recommend using grid layout") }}
        </p>
      </card>

      <card v-if="!onboarding">
        <h3 slot="header">{{ $t("number of products in each section") }}</h3>

        <i18n-t keypath="display {size} products in each product section" tag="p">
          <template v-slot:size>
            <el-input-number class="narrow-input inline-input" v-model="current.section_size" controls-position="right"
              step-strictly :min="4" :max="16" place="size" />
          </template>
        </i18n-t>

        <el-slider v-model="current.section_size" :show-tooltip="false" :min="4" :max="16" />
      </card>

      <card v-if="!onboarding">
        <div slot="header" class="flex-header">
          <h3>{{ $t("hide out of stock products") }}</h3>
          <el-switch v-model="hideOutOfStock" active-color="#fdb809" />
        </div>
        <p>
          {{ $t(hideOutOfStock ? "outOfStock:hidden" : "outOfStock:shown") }}
        </p>
      </card>
      <card v-if="!onboarding">
        <div slot="header" class="flex-header">
          <h3>{{ $t("prioritize discounted products") }}</h3>
          <el-switch v-model="promoteDiscounts" active-color="#fdb809" />
        </div>

        <el-collapse-transition>
          <div v-show="current.pct_promote_discounts > 0">
            <i18n-t keypath="display {discount} first in each product section" tag="p">
              <template #discount>
                <i18n-t keypath="{percent} discount and higher" tag="strong">
                  <template #percent>
                    <el-input-number size="small" class="narrow-input inline-input"
                      v-model="current.pct_promote_discounts" controls-position="right" step-strictly :min="0" :max="95"
                      :step="5" />
                  </template>
                </i18n-t>
              </template>
            </i18n-t>

            <el-slider v-model="current.pct_promote_discounts" :show-tooltip="false" :min="0" :max="95" :step="5" />
          </div>
        </el-collapse-transition>

        <div class="discount-preview">
          <img v-if="current.pct_promote_discounts === 0" svg-inline
            src="@/assets/img/settings/promote-discounts-0.svg" />
          <img v-else-if="current.pct_promote_discounts <= 40" svg-inline
            src="@/assets/img/settings/promote-discounts-40.svg" />
          <img v-else-if="current.pct_promote_discounts <= 50" svg-inline
            src="@/assets/img/settings/promote-discounts-50.svg" />
          <img v-else-if="current.pct_promote_discounts <= 70" svg-inline
            src="@/assets/img/settings/promote-discounts-70.svg" />
          <img v-else-if="current.pct_promote_discounts <= 80" svg-inline
            src="@/assets/img/settings/promote-discounts-80.svg" />
          <img v-else-if="current.pct_promote_discounts <= 90" svg-inline
            src="@/assets/img/settings/promote-discounts-90.svg" />
          <img v-else svg-inline src="@/assets/img/settings/promote-discounts-0.svg" />
        </div>

        <hr />
        <p class="footnote">
          <i class="ti-info" />
          {{
              $t("by default product recommendations are ordered by relevance")
          }}
        </p>
      </card>

      <card>
        <a id="designer">
          <h3 slot="header">{{ $t("customize recommendations") }}</h3>
        </a>

        <div class="row">
          <div class="col-xl-5">
            <el-collapse accordion v-model="currentSection.custom_styles"
              @change="handleCurrentSectionChange('custom_styles', $event)">
              <el-collapse-item name="header">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="styles.header.active">{{
                        $t("header styles")
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'header'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button size="small" @click="handleSectionReset('custom_styles', 'header')">{{ $t("reset") }}
                    </el-button>
                  </span>
                </template>
                <el-form :model="styles.header" size="small" label-width="200px" :disabled="!styles.header.active">
                  <el-form-item :label="$t('alignment')">
                    <el-radio-group v-model="styles.header['text-align']">
                      <el-radio-button label="left">
                        <i class="ti-align-left"></i>
                        <span class="sr-only">{{ $t("align:left") }}</span>
                      </el-radio-button>
                      <el-radio-button label="center">
                        <i class="ti-align-center"></i>
                        <span class="sr-only">{{ $t("align:center") }}</span>
                      </el-radio-button>
                      <el-radio-button label="right">
                        <i class="ti-align-right"></i>
                        <span class="sr-only">{{ $t("align:right") }}</span>
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item :label="$t('text color')">
                    <el-color-picker v-model="styles.header.color" />
                  </el-form-item>

                  <el-form-item :label="$t('font size')">
                    <el-input-number v-model="styles.header['font-size']" :min="1"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('font weight')">
                    <el-input-number v-model="styles.header['font-weight']" :min="100" :max="900" :step="100">
                    </el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('transform')">
                    <el-radio-group v-model="styles.header['text-transform']">
                      <el-radio-button label="none">{{
                          $t("none")
                      }}</el-radio-button>
                      <el-radio-button label="uppercase">{{
                          $t("uppercase")
                      }}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item :label="$t('decorations')">
                    <el-checkbox v-model="styles.header.decorations.active"></el-checkbox>
                  </el-form-item>

                  <el-form-item :label="$t('line thickness')">
                    <el-input-number v-model="styles.header.decorations['border-bottom-width']" :min="1" :max="50"
                      :disabled="!styles.header.decorations.active"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('line color')">
                    <el-color-picker v-model="styles.header.decorations['border-color']"
                      :disabled="!styles.header.decorations.active" />
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-collapse-item name="photo">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="styles.photo.active">{{
                        $t("product photo styles")
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'photo'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button size="small" @click="handleSectionReset('custom_styles', 'photo')">{{ $t("reset") }}
                    </el-button>
                  </span>
                </template>
                <el-form :model="styles.photo" size="small" label-width="200px" :disabled="!styles.photo.active">
                  <el-form-item :label="$t('border width')">
                    <el-input-number v-model="styles.photo['border-width']" :min="0" :max="25"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('border color')">
                    <el-color-picker v-model="styles.photo['border-color']" />
                  </el-form-item>

                  <el-form-item :label="$t('padding')">
                    <el-input-number v-model="styles.photo.padding" :min="0" :max="25"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('keep proportions')">
                    <el-checkbox v-model="styles.photo.proportions.active"></el-checkbox>
                  </el-form-item>

                  <el-form-item :label="$t('aspect ratio')">
                    <el-radio-group v-model="styles.photo.proportions['aspect-ratio']"
                      :disabled="!styles.photo.proportions.active">
                      <el-radio-button class="aspect-ratio-radio" v-for="option in aspectRatios"
                        :key="`${option[0]}/${option[1]}`" :label="`${option[0]}/${option[1]}`">
                        {{ option[0] }}:{{ option[1] }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-collapse-item name="tag">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="styles.tag.active">{{
                        $t("discount tag styles")
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'tag'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button size="small" @click="handleSectionReset('custom_styles', 'tag')">{{ $t("reset") }}
                    </el-button>
                  </span>
                </template>
                <el-form :model="styles.tag" size="small" label-width="200px" :disabled="!styles.tag.active">
                  <el-form-item :label="$t('style')">
                    <el-radio-group v-model="styles.tag.style">
                      <el-radio-button label="classic">{{
                          $t("style:classic")
                      }}</el-radio-button>
                      <el-radio-button label="minimal">{{
                          $t("style:minimal")
                      }}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item :label="$t('text color')">
                    <el-color-picker v-model="styles.tag.color" />
                  </el-form-item>

                  <el-form-item :label="$t('background')">
                    <el-color-picker v-model="styles.tag['background-color']" />
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-collapse-item name="title">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="styles.title.active">{{
                        $t("product title styles")
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'title'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button size="small" @click="handleSectionReset('custom_styles', 'title')">{{ $t("reset") }}
                    </el-button>
                  </span>
                </template>
                <el-form :model="styles.title" size="small" label-width="200px" :disabled="!styles.title.active">
                  <el-form-item :label="$t('alignment')">
                    <el-radio-group v-model="styles.title['text-align']">
                      <el-radio-button label="left">
                        <i class="ti-align-left"></i>
                        <span class="sr-only">{{ $t("align:left") }}</span>
                      </el-radio-button>
                      <el-radio-button label="center">
                        <i class="ti-align-center"></i>
                        <span class="sr-only">{{ $t("align:center") }}</span>
                      </el-radio-button>
                      <el-radio-button label="right">
                        <i class="ti-align-right"></i>
                        <span class="sr-only">{{ $t("align:right") }}</span>
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item :label="$t('text color')">
                    <el-color-picker v-model="styles.title.color" />
                  </el-form-item>

                  <el-form-item :label="$t('font size')">
                    <el-input-number v-model="styles.title['font-size']" :min="1"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('font weight')">
                    <el-input-number v-model="styles.title['font-weight']" :min="100" :max="900" :step="100">
                    </el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('transform')">
                    <el-radio-group v-model="styles.title['text-transform']">
                      <el-radio-button label="none">{{
                          $t("none")
                      }}</el-radio-button>
                      <el-radio-button label="uppercase">{{
                          $t("uppercase")
                      }}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-collapse-item name="price">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="styles.price.active">{{
                        $t("price styles")
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'price'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button size="small" @click="handleSectionReset('custom_styles', 'price')">{{ $t("reset") }}
                    </el-button>
                  </span>
                </template>
                <el-form :model="styles.price" size="small" label-width="200px" :disabled="!styles.price.active">
                  <el-form-item :label="$t('alignment')">
                    <el-radio-group v-model="styles.price['text-align']">
                      <el-radio-button label="left">
                        <i class="ti-align-left"></i>
                        <span class="sr-only">{{ $t("align:left") }}</span>
                      </el-radio-button>
                      <el-radio-button label="center">
                        <i class="ti-align-center"></i>
                        <span class="sr-only">{{ $t("align:center") }}</span>
                      </el-radio-button>
                      <el-radio-button label="right">
                        <i class="ti-align-right"></i>
                        <span class="sr-only">{{ $t("align:right") }}</span>
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>

                  <label class="form-subheader">{{
                      $t("current price")
                  }}</label>

                  <el-form-item :label="$t('color')">
                    <el-color-picker v-model="styles.price.current.color" />
                  </el-form-item>

                  <el-form-item :label="$t('font size')">
                    <el-input-number v-model="styles.price.current['font-size']" :min="1"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('font weight')">
                    <el-input-number v-model="styles.price.current['font-weight']" :min="100" :max="900" :step="100">
                    </el-input-number>
                  </el-form-item>

                  <label class="form-subheader">{{ $t("full price") }}</label>

                  <el-form-item :label="$t('color')">
                    <el-color-picker v-model="styles.price.full.color" />
                  </el-form-item>

                  <el-form-item :label="$t('font size')">
                    <el-input-number v-model="styles.price.full['font-size']" :min="1"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('font weight')">
                    <el-input-number v-model="styles.price.full['font-weight']" :min="100" :max="900" :step="100">
                    </el-input-number>
                  </el-form-item>

                  <label class="form-subheader">{{
                      $t("discount price")
                  }}</label>

                  <el-form-item :label="$t('color')">
                    <el-color-picker v-model="styles.price.discount.color" />
                  </el-form-item>

                  <el-form-item :label="$t('font size')">
                    <el-input-number v-model="styles.price.discount['font-size']" :min="1"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('font weight')">
                    <el-input-number v-model="styles.price.discount['font-weight']" :min="100" :max="900" :step="100">
                    </el-input-number>
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-collapse-item name="layout">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="styles.layout.active">{{
                        $t("layout styles")
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'layout'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button @click="handleSectionReset('custom_styles', 'layout')">{{ $t("reset") }}
                    </el-button>
                  </span>
                </template>
                <el-form :model="styles.layout" size="small" label-width="200px" :disabled="!styles.layout.active">
                  <el-form-item v-if="current.section_layout === 'slider'" :label="$t('show next item')">
                    <el-checkbox v-model="styles.layout.show_next_item"></el-checkbox>
                  </el-form-item>

                  <el-form-item :label="$t('items per page')">
                    {{ $t("layout:between") }}
                    <el-input-number class="narrow-input inline-input" controls-position="right"
                      v-model="styles.layout.items_per_page.mobile" :min="1" :max="styles.layout.items_per_page.desktop"
                      :step="1"></el-input-number>
                    {{ $t("layout:and") }}
                    <el-input-number class="narrow-input inline-input" controls-position="right"
                      v-model="styles.layout.items_per_page.desktop" :min="styles.layout.items_per_page.mobile"
                      :max="10" :step="1"></el-input-number>
                    {{ $t("layout:screensize") }}
                  </el-form-item>

                  <el-form-item :label="$t('advanced')">
                    <el-checkbox v-model="styles.layout.advanced.active"></el-checkbox>
                  </el-form-item>

                  <el-form-item :label="$t('section spacing')">
                    <el-input-number v-model="styles.layout.advanced.spacing" :min="0" :max="4"
                      :disabled="!styles.layout.advanced.active"></el-input-number>
                  </el-form-item>

                  <el-form-item :label="$t('max section width')">
                    <el-input-number v-model="styles.layout.advanced['max-width']" :min="288" :step="1"
                      :disabled="!styles.layout.advanced.active"></el-input-number>
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-collapse-item name="fields">
                <template #title>
                  <el-checkbox checked disabled />
                  <span class="el-checkbox__input is-checked" />
                  <span class="el-checkbox__label">{{
                      $t("product details")
                  }}</span>
                  <span v-if="currentSection.custom_styles === 'fields'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button size="small" @click="handleFieldsReset()">{{
                        $t("reset")
                    }}</el-button>
                  </span>
                </template>
                <el-form size="small" label-width="200px" :disabled="!styles.title.active">
                  <el-form-item :label="$t('show details')">
                    <el-checkbox-group class="show-fields" v-model="current.show_fields">
                      <el-checkbox v-for="field in productFields" :key="field" :label="field">{{ $t(`field:${field}`) }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
              <el-collapse-item name="cta-btn">
                <template #title>
                  <span @click.stop @keyup.stop>
                    <el-checkbox v-model="current.cta_button.show_button">{{
                        $t(
                          client.type === "shopify"
                            ? "add to cart button"
                            : "buy button"
                        )
                    }}</el-checkbox>
                  </span>
                  <span v-if="currentSection.custom_styles === 'cta-btn'" class="collapse-item-reset" @click.stop
                    @keyup.stop>
                    <el-button @click="handleFieldsReset()">{{
                        $t("reset")
                    }}</el-button>
                  </span>
                </template>
                <el-form size="small" label-width="200px" :disabled="!current.cta_button.show_button">
                  <el-form-item :label="$t('add to cart caption')">
                    <el-input v-model="current.cta_button.caption" :placeholder="
                      $t(client.type === 'shopify' ? 'add to cart' : 'buy')
                    "></el-input>
                  </el-form-item>
                  <el-form-item v-if="client.type === 'shopify'" :label="$t('buy btn caption')">
                    <el-input v-model="current.cta_button.buy_caption" :placeholder="
                      $t(client.type === 'shopify' ? 'add to cart' : 'buy')
                    "></el-input>
                    <small>{{ $t("buy-btn:helper text") }}</small>
                  </el-form-item>
                  <el-form-item :label="$t('css classes')">
                    <el-input v-model="current.cta_button.classes"></el-input>
                    <small>{{ $t("css classes:helper text") }}</small>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </div>

          <div class="col-xl-7">
            <el-alert type="info" show-icon :closable="false" :title="$t('this is a preview')" />
            <products-preview :api-key="apikey" :type="current.section_layout" :product-count="current.section_size"
              :show-fields="current.show_fields" :styles="getPlainObject(current.custom_styles)" />
          </div>
        </div>
      </card>
    </template>
    <loader-dots v-else />
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import * as Sentry from "@sentry/browser";
import { mapActions, mapGetters } from "vuex";
import { supportedLanguages } from "@/lang/lang";
import { nilDefaultsDeep } from "@/api/utils";
import { defineComponent } from "vue";

import Card from "@/components/Cards/Card.vue";
import PendingSettings from "@/components/Settings/PendingSettings.vue";
import LoaderDots from "@/components/LoaderDots.vue";
import ProductsPreview from "@/components/ProductsPreview.vue";
import {
  userGuideLinks,
  titlePlaceholders,
  productFields,
  aspectRatios,
  defaultProductSettings,
} from "./product";

export default defineComponent({
  name: "Products",
  components: {
    Card,
    LoaderDots,
    ProductsPreview,
    PendingSettings,
  },
  data() {
    return {
      saving: false,
      currentSection: {
        context: "",
        custom_styles: "",
      },
      userGuideLinks: userGuideLinks,
      titlePlaceholders: titlePlaceholders,
      productFields: productFields,
      aspectRatios: aspectRatios,
      default: defaultProductSettings,
      lastSaved: {},
      current: null,
    };
  },
  computed: {
    ...mapGetters(["client", "subscription", "apikey", "languageCode"]),
    ...mapGetters("settings", [
      "webSettings",
      "pageInstallationSettings",
      "pageStatus",
    ]),
    productAccess() {
      if (!this.apikey) {
        return {};
      }
      return this.subscription?.access?.personalization?.products;
    },
    products() {
      try {
        return this.webSettings.recommendations.products;
      } catch {
        return null;
      }
    },
    language() {
      let language = this.client?.profile?.locale?.language || "en";
      if (supportedLanguages.includes(language)) {
        return language;
      }
      return "en";
    },
    promoteDiscounts: {
      get() {
        return this.current.pct_promote_discounts > 0;
      },
      set(v) {
        this.current.pct_promote_discounts = v
          ? this.lastSaved.pct_promote_discounts || 50
          : 0;
      },
    },
    hideOutOfStock: {
      get() {
        return this.current.hide_out_of_stock || false;
      },
      set(v) {
        this.current.hide_out_of_stock = v || false;
      },
    },
    styles() {
      return this.current.custom_styles;
    },
    hasUnsavedChanges() {
      if (!this.current) {
        return false;
      }
      return !isEqual(this.current, this.lastSaved);
    },
    installGuideLink() {
      return this.languageCode === "es"
        ? "https://help.datacue.co/es/install/"
        : "https://help.datacue.co/install/";
    },
    pageCheckEnabled() {
      return ["shopify"].includes(this.client.type);
    },
  },
  methods: {
    ...mapActions("settings", [
      "getWebSettings",
      "saveSettings",
      "getPageInstallationSettings",
    ]),
    handleCurrentSectionChange(collapse, section) {
      if (section && this.current[collapse][section]) {
        this.current[collapse][section].active = true;
      }
    },
    handleSectionReset(collapse, section) {
      this.currentSection[collapse] = "";
      this.current[collapse][section] = cloneDeep(
        this.default[collapse][section]
      );
    },
    handleFieldsReset() {
      this.currentSection.custom_styles = "";
      this.current.show_fields = [...this.default.show_fields];
    },
    getPlainObject(obj) {
      try {
        return JSON.parse(JSON.stringify(obj));
      } catch (err) {
        Sentry.captureException(err);
        return {};
      }
    },
    async checkPageStatus(page) {
      try {
        await this.getPageInstallationSettings(page);
      } catch (err) {
        Sentry.captureException(err);
      }
    },
    async refreshData() {
      try {
        if (this.products) {
          this.current = nilDefaultsDeep({}, this.products || {}, this.default);
          this.lastSaved = cloneDeep(this.products || {});
        }
        await this.getWebSettings();
        this.lastSaved = cloneDeep(this.products || {});
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.current = nilDefaultsDeep({}, this.products || {}, this.default);
      }
      await this.checkPageStatus("all");
    },
    async saveChanges() {
      this.saving = true;
      try {
        const newSettings = cloneDeep(this.webSettings);
        newSettings.recommendations.products = cloneDeep(this.current);
        await this.saveSettings({ web_settings: newSettings });
        this.lastSaved = cloneDeep(this.products || {});
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        this.saving = false;
      }
    },
  },
  mounted() {
    this.refreshData();
  },
  props: {
    onboarding: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/datacue/_colors.scss";

/* TODO: move this to global styles */
.card>.card-header h3 {
  margin: 0;
}

.card>.card-body {
  padding: 20px;
}

.card>.card-body h3 {
  padding-right: 20px;
  margin: 20px 0;
}

.card>label {
  margin-bottom: 0;
}

.flex-header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.card>.card-header .flex-header>* {
  margin: 0 1rem 0 0;
}

.footnote {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.user-guide-link {
  display: none;
  margin-left: 1rem;
}

.el-collapse-item:hover .user-guide-link {
  display: inline;
}

.collapse-item-reset {
  margin-left: auto;
}

.collapse-item-reset+* {
  margin-left: 1rem;
}

.el-collapse-item .el-form {
  padding-left: 24px;
}

.page-switch-wrapper {
  display: flex;
  flex-flow: row;
  align-items: center;
  min-height: 2em;
}

.page-switch-wrapper+.page-switch-wrapper {
  margin-top: 0.5em;
}

small.el-form-item--small {
  line-height: 16px;
}

.page-switch-wrapper> :first-child {
  flex: 0 0 200px;
}

.page-switch-wrapper p {
  display: inline;
  margin: 0 0.5em;
  font-size: 12px;
  color: #999;
}

.page-switch-wrapper .el-button {
  margin-left: auto;
}

.page-switch-wrapper .el-switch>.el-switch__label,
.page-switch-wrapper .el-switch>.el-switch__label.is-active {
  color: #999;
}

.layout-picker svg {
  fill: #c7c7c7;
}

.layout-picker .el-radio {
  margin: 0 1em 0.5em 0;
}

.discount-preview {
  max-width: 50rem;
}

.discount-preview svg {
  fill: #c7c7c7;
}

.inline-input {
  margin: 0 0.25em;
}

.inline-input>.el-input {
  font-size: inherit;
}

.narrow-input {
  width: 100px;
}

.narrow-input.is-controls-right {
  width: 72px;
}

.narrow-input.is-controls-right>.el-input__inner {
  padding-left: 4px;
  padding-right: 32px;
}

.aspect-ratio-radio>.el-radio-button__inner {
  padding-left: 6px;
  padding-right: 6px;
}

.show-fields {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
</style>
<style>
.el-slider__bar {
  background-color: #e6a23c !important;
}

.el-slider__button {
  border: 2px solid #e6a23c !important;
}

.el-button:focus,
.el-button:hover {
  color: #555 !important;
  border-color: #fab800 !important;
  background-color: #fcefcb !important;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #fab800 !important;
}

.el-switch__label.is-active {
  color: #999 !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fab800 !important;
  border-color: #fab800 !important;
}

.el-radio__input.is-checked .el-radio__inner,
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #fab800 !important;
  border-color: #fab800 !important;
}

.el-radio.is-checked .el-radio__label {
  color: #fab800 !important;
}

.el-radio-group {
  display: flex !important;
}

.el-tab-pane {
  padding: 10px 0;
}

.el-collapse-item__arrow.is-active {
  margin: 0 10px 0 10px !important;
}

.el-form-item__content {
  align-items: start !important;
  flex-direction: column;
}

.el-radio-button__inner:hover {
  color: #fab800 !important;
}

.el-radio-button.is-active .el-radio-button__inner:hover {
  color: #fff !important;
}

.el-radio-button__inner.is-active {
  color: #fff !important;
}

.el-radio-button__original-radio:checked+.el-radio-button__inner {
  background-color: #fab800 !important;
  border-color: #fab800 !important;
  box-shadow: none !important;
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #fab800 !important;
}

.el-input-number__decrease:hover,
.el-input-number__increase:hover {
  color: #fab800 !important;
}

.is-disabled>div>div>i.el-collapse-item__arrow.el-icon-arrow-right {
  background-image: none;
  font-family: "themify" !important;
}

.is-disabled>div>div>i.el-collapse-item__arrow.el-icon-arrow-right::before {
  content: "\e62b" !important;
}
</style>

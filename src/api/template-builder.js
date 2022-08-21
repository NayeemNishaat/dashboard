import chunk from "lodash/chunk";
import values from "lodash/values";
import Color from "color";

const templateTypes = {
  WE_MISS_YOU: "we-miss-you"
};

export function getTemplateTypes() {
  return templateTypes;
}

export function isValidTemplateType(templateType) {
  return values(templateTypes).includes(templateType);
}

const textSize = {
  small: "20px",
  medium: "26px",
  large: "32px"
};

function adjustTextColor(initial, bg = initial) {
  bg = Color(bg).hsl();

  const contrast = hsl => Color(hsl).contrast(bg);

  const text = bg.object();
  text.s = Math.min(text.s, 5);

  if (bg.isLight()) {
    while (text.l >= 1 && contrast(text) < 7) {
      --text.l;
    }
  } else {
    while (text.l <= 99 && contrast(text) < 7) {
      ++text.l;
    }
  }

  return Color(text);
}

function escapeJinja(str) {
  return str.replace(/\{+%+|%+\}+/g, "");
}

function formatPrice(value, { pricing, language }) {
  if (pricing && pricing.currency && pricing.separator) {
    let formattedValue = (+value).toFixed(pricing.show_cents).split(".");
    if (pricing.separator.group) {
      formattedValue[0] = formattedValue[0].replace(
        /\B(?=(\d{3})+(?!\d))/g,
        pricing.separator.group
      );
    }

    formattedValue = formattedValue.join(pricing.separator.decimal || ".");

    if (pricing.currency.placement === "front") {
      return `${pricing.currency.symbol}${pricing.separator.currency}${formattedValue}`;
    }

    return `${formattedValue}${pricing.separator.currency}${pricing.currency.symbol}`;
  }

  // FALLBACK: es_CL, en_US
  if (language === "es") {
    return "$" + (+value).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return "$" + (+value).toFixed(2);
}

export function buildTemplateMjml(templateType, state, target = "preview") {
  switch (templateType) {
    case templateTypes.WE_MISS_YOU: {
      const { content, settings, products = [] } = state;

      const bgString = settings.logoBackground
        ? `background-color="${settings.mainColor}"`
        : "";

      let logo = `<mj-spacer height="50px"/>`;
      if (content.logo) {
        const logoWidth = Math.round(
          content.logo.width * (50 / content.logo.height)
        );

        logo = `
          <mj-image padding="0"
            width="${logoWidth}px"
            src="${content.logo.src}"
            href="${settings.logoLink || ""}"
          />`;
      }

      let cover = "";
      if (content.cover) {
        cover = `
          <mj-section padding="0 20px 20px">
            <mj-column padding="0">
              <mj-image padding="0" src="${content.cover.src}"/>
            </mj-column>
          </mj-section>
        `;
      }

      const textColor = adjustTextColor(settings.mainColor, "#fff");
      const buttonTextColor = adjustTextColor(settings.mainColor);

      let productGrid = "";
      let unsubscribeLink = "https://unsubscribe.datacue.co/";

      if (target === "preview") {
        productGrid = chunk(products, 3)
          .map(
            products => `
              <mj-section padding="0 5px 0 20px">
                ${products
                  .map(
                    product => `
                      <mj-column
                        padding="15px 15px 15px 0"
                        vertical-align="bottom"
                      >
                        <mj-image
                          padding="0"
                          fluid-on-mobile="true"
                          src="${product.photo_url}"
                          alt="${product.name}"
                          href="#"
                        />

                        <mj-text padding="15px 0 0" height="32px"
                          align="left"
                          color="${textColor.darken(0.25).hex()}"
                          font-family="${settings.font}"
                          font-size="16px"
                        >
                          ${product.name}
                        </mj-text>

                        <mj-text padding="10px 0 15px" height="15px"
                          align="left"
                          color="${textColor.hex()}"
                          font-family="${settings.font}"
                          font-size="12px"
                        >
                          <s>${formatPrice(product.full_price, settings)}</s>
                          <span style="color: ${settings.discountColor}">
                            <strong>
                              ${formatPrice(product.price, settings)}
                            </strong>
                          </span>
                        </mj-text>

                        <mj-button padding="0"
                          border-radius="0"
                          href="#"
                          background-color="${settings.mainColor}"
                          font-family="${settings.font}"
                          font-size="14px"
                          color="${buttonTextColor.hex()}"
                          width="100%"
                        >
                          ${escapeJinja(content.button) || "See more"}
                        </mj-button>
                      </mj-column>
                    `
                  )
                  .join("")}
              </mj-section>
            `
          )
          .join("");
      } else if (target === "jinja") {
        unsubscribeLink = "{{ unsubscribe }}";
        productGrid = `
          {% for row in promotions %}
            <mj-section padding="0 5px 0 20px">
              {% for product in row %}
                <mj-column
                  padding="15px 15px 15px 0"
                  vertical-align="bottom"
                >
                  <mj-image
                    padding="0"
                    fluid-on-mobile="true"
                    src="{{ product.photo_url }}"
                    alt="{{ product.name }}"
                    href="{{ product.link }}"
                  />

                  <mj-text padding="15px 0 0" height="32px"
                    align="left"
                    color="${textColor.darken(0.25).hex()}"
                    font-family="${settings.font}"
                    font-size="16px"
                  >
                    {{ product.name }}
                  </mj-text>

                  <mj-text padding="10px 0 15px" height="15px"
                    align="left"
                    color="${textColor.hex()}"
                    font-family="${settings.font}"
                    font-size="12px"
                  >
                    {% if product.price == product.full_price %}
                      {{ product.price }}
                    {% else %}
                      <s>{{ product.full_price }}</s>
                      <span style="color: ${settings.discountColor}">
                        <strong>{{ product.price }}</strong>
                      </span>
                    {% endif %}
                  </mj-text>

                  <mj-button padding="0"
                    border-radius="0"
                    href="{{ product.link }}"
                    background-color="${settings.mainColor}"
                    font-family="${settings.font}"
                    font-size="14px"
                    color="${buttonTextColor.hex()}"
                    width="100%"
                  >
                    ${escapeJinja(content.button) || "See more"}
                  </mj-button>
                </mj-column>
              {% endfor %}
            </mj-section>
          {% endfor %}
        `;
      }

      const preview = `
        <mjml>
          <mj-body>
            <mj-section padding="20px 20px 0"
              ${bgString}
            >
              <mj-column
                padding="${settings.logoBackground ? "0 0 20px" : "0"}"
              >
                ${logo}
              </mj-column>
            </mj-section>

            <mj-section padding="30px 20px">
              <mj-column padding="0">
                <mj-text padding="0"
                  align="${settings.headingAlign}"
                  color="${textColor.hex()}"
                  font-family="${settings.font}"
                  font-size=${textSize[settings.headingSize]}
                  font-weight="${settings.headingBold ? "bold" : "normal"}"
                >
                  ${escapeJinja(content.heading)}
                </mj-text>
              </mj-column>
            </mj-section>

            ${cover}

            <mj-section padding="0 20px 15px">
              <mj-column padding="0">
                <mj-text padding="0"
                  align="${settings.bodyAlign}"
                  color="${textColor.hex()}"
                  font-family="${settings.font}"
                  font-size="14px"
                  line-height="18px"
                >
                  ${escapeJinja(content.body)}
                </mj-text>
              </mj-column>
            </mj-section>

            ${productGrid}

            <mj-section padding="15px 20px">
              <mj-column padding="0">
                <mj-text padding="0"
                  align="${settings.bodyAlign}"
                  color="${textColor.hex()}"
                  font-family="${settings.font}"
                  font-size="12px"
                  line-height="15px"
                >
                  ${escapeJinja(content.footer)}
                </mj-text>

                <mj-text padding="15px 0 0"
                  align="${settings.bodyAlign}"
                  color="${textColor.hex()}"
                  font-family="${settings.font}"
                  font-size="12px"
                  line-height="15px"
                >
                  <a target="_blank"
                    href="${unsubscribeLink}"
                    style="color: ${textColor.hex()}"
                  >
                    ${content.unsubscribeText}
                  </a>
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;

      return preview;
    }

    default:
      return "";
  }
}

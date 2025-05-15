import { Request, Response } from "express";
import nacl from "tweetnacl";
import {
  Entitlement,
  Guild,
  User,
  WebhookRequest,
  WebhookType
} from "../../../../modules/types.js";

type ApplicationAuthorizedData = {
  integration_type?: number;
  user: User;
  scopes: string[];
  guild?: Guild;
};

export default async function (
  req: Request,
  res: Response,
  route: { [key: string]: string }
) {
  const headers: { [key: string]: string } = req.headers as {
    [key: string]: string;
  };

  const Signature: string | string[] | undefined =
    headers["x-signature-ed25519"];
  const Timestamp: string | string[] | undefined =
    headers["x-signature-timestamp"];
  const Body: string = JSON.stringify(req.body);

  const isVerified: boolean = nacl.sign.detached.verify(
    Buffer.from(Timestamp + Body),
    Buffer.from(Signature ?? "", "hex"),
    Buffer.from(process.env.PUBLIC_KEY ?? "", "hex")
  );

  if (!isVerified) return res.status(403).end();

  const Data: WebhookRequest = JSON.parse(Body);

  if (Data.type == WebhookType.PING) {
    return res.status(204).end();
  } else {
    if (Data.event?.type == "APPLICATION_AUTHORIZED") {
      const EventData: ApplicationAuthorizedData = Data.event.data;

      await fetch(
        "https://discord.com/api/channels/1329592440616652841/messages",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              embeds: [
                {
                  title: "Application Authorized",
                  description: `**Type:** ${
                    EventData.integration_type == 0 ? "Guild" : "User"
                  }`,
                  thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${EventData.user.id}/${EventData.user.avatar}.png`
                  },
                  fields: [
                    {
                      name: "User",
                      value: `**@${EventData.user.username}** (${EventData.user.id})`
                    },
                    {
                      name: "Guild",
                      value: `${
                        EventData.integration_type == 0
                          ? `**${EventData.guild?.name}** (${EventData.guild?.id})`
                          : `N/A`
                      }`
                    },
                    {
                      name: "Scopes",
                      value:
                        EventData.scopes.length > 0
                          ? EventData.scopes.join(", ")
                          : "No scopes."
                    }
                  ]
                }
              ]
            },
            null,
            ""
          )
        }
      );

      return res.status(204).end();
    } else if (Data.event?.type == "ENTITLEMENT_CREATE") {
      const EventData: Entitlement = Data.event.data;

      await fetch(
        "https://discord.com/api/channels/1372681641218281523/messages",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              embeds: [
                {
                  title: "Application Authorized",
                  description: `**Type:** ${EventData.type
                    .toString()
                    .toLowerCase()
                    .replaceAll("_", " ")
                    .replace(/^\w/, (c) => c.toUpperCase())}`,
                  fields: [
                    {
                      name: "User",
                      value: `<@${EventData.user_id}> (${EventData.user_id})`
                    },
                    {
                      name: "Guild",
                      value: EventData.guild_id
                        ? `${EventData.guild_id}`
                        : `N/A`
                    },
                    {
                      name: "SKU",
                      value: EventData.sku_id ? `${EventData.sku_id}` : `N/A`
                    },
                    {
                      name: "Start",
                      value:
                        new Date(EventData.starts_at ?? "").toLocaleString() ??
                        "N/A",
                      inline: true
                    },
                    {
                      name: "End",
                      value:
                        new Date(EventData.ends_at ?? "").toLocaleString() ??
                        "N/A",
                      inline: true
                    },
                    {
                      name: "Consumed",
                      value: EventData.consumed ? "Yes" : "No",
                      inline: true
                    },
                    {
                      name: "Deleted",
                      value: EventData.deleted ? "Yes" : "No",
                      inline: true
                    }
                  ],
                  footer: {
                    text: `Entitlement ID: ${EventData.id}`
                  }
                }
              ]
            },
            null,
            ""
          )
        }
      );

      return res.status(204).end();
    }
  }
  return res.status(400).json({ status: 400, message: "Invalid data" });
}

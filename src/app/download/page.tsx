import { permanentRedirect } from "next/navigation";

export default function DownloadRedirectPage() {
  permanentRedirect("/cloud");
}

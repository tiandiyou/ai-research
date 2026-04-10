import { registerRoot } from "@remotion/shell";
import { RemotionServer } from "@remotion/server";
import { getCli Args } from "@remotion/cli";

registerRoot();

const args = getCli Args();

const serve = async () => {
  const { port, staticDir } = args;
  const { send } = await RemotionServer({
    port,
    staticDir,
  });
  
  console.log(`Server running at http://localhost:${port}`);
  process.exit(0);
};

serve();
